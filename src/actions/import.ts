"use server";

import { db } from "@/lib/drizzle";
import { students, subjects, users } from "@/db/schema";
import { assertPermission } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function importStudentsFromCSV(formData: FormData) {
    await assertPermission('admin');

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "File tidak ditemukan" };

    const text = await file.text();
    const lines = text.split("\n");
    // Format based on UI Tip: 
    // Nama Siswa, Level, Tanggal Lahir (YYYY-MM-DD), Nama Orang Tua, Email Orang Tua, No WA
    // Index: 0, 1, 2, 3, 4, 5

    const dataRows = lines.slice(1).filter(line => line.trim() !== "");

    let successCount = 0;

    try {
        await db.transaction(async (tx) => {
            for (const line of dataRows) {
                // Split by comma, handling quotes if necessary (simple regex for standard CSV)
                // Note: simple split might break if fields contain commas. 
                // For MVP without library, we assume standard clean CSV.
                const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ''));

                if (cols.length < 2) continue; // Skip empty/malformed

                const [studentName, level, birthDateRaw, parentName, parentEmail, whatsapp] = cols;

                // 1. Handle Parent (User)
                // Check if key fields exist
                let parentId: string | undefined;

                if (parentEmail && parentEmail.includes("@")) {
                    // Check if parent user already exists
                    // We must use query inside transaction to see uncommitted changes if iterating? 
                    // Drizzle transaction isolation usually sees own writes.
                    const existingUser = await tx.query.users.findFirst({
                        where: (u, { eq }) => eq(u.email, parentEmail)
                    });

                    if (existingUser) {
                        parentId = existingUser.id;
                    } else if (parentName) {
                        // Create New Parent User
                        const [newUser] = await tx.insert(users).values({
                            name: parentName,
                            email: parentEmail,
                            role: 'parent',
                            emailVerified: new Date(), // Auto verify for imported?
                        }).returning();
                        parentId = newUser.id;
                    }
                }

                // 2. Handle Student
                // Validate Dates
                const validBirthDate = birthDateRaw && birthDateRaw.match(/^\d{4}-\d{2}-\d{2}$/)
                    ? birthDateRaw
                    : null;
                // If invalid, null (optional)

                const validJoinDate = new Date().toISOString().split('T')[0];

                const [newStudent] = await tx.insert(students).values({
                    name: studentName,
                    level: level || "3A",
                    parentId: parentId, // Link to parent if found/created
                    whatsapp: whatsapp || null,
                    birthDate: validBirthDate as string | undefined, // Type cast for strict ddl
                    joinDate: validJoinDate,
                    status: 'ACTIVE'
                }).returning();

                // 3. Handle Subjects
                // Defaulting to "Math" and "English" (Subject creation)
                // Or maybe just "Math" if typical.
                // Request says "insert ke tabel ... subjects". 
                // Let's add standard subjects.
                const subjectList = ["Math"];
                // If level contains "EFL" maybe English? Let's just add Math for now as core.

                await tx.insert(subjects).values(
                    subjectList.map(s => ({
                        studentId: newStudent.id,
                        name: s,
                        currentLevel: level || "3A",
                    }))
                );

                successCount++;
            }
        });

        revalidatePath("/");
        revalidatePath("/admin/students");
        return { success: true, message: `Berhasil import ${successCount} siswa & parent.` };

    } catch (error) {
        console.error("Import Error:", error);
        return { success: false, error: "Gagal memproses file CSV. Cek format data." };
    }
}
