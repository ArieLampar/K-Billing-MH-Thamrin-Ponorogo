"use server";

import { db } from "@/lib/drizzle";
import { students, subjects } from "@/db/schema";
import { assertPermission } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { studentSchema, StudentInput } from "@/lib/schemas";
import { eq, ilike } from "drizzle-orm";

// Search Action for Ops
export async function searchStudents(term: string) {
    if (!term || term.length < 3) return [];

    const results = await db.select({
        id: students.id,
        name: students.name,
        level: students.level,
    })
        .from(students)
        .where(ilike(students.name, `%${term}%`))
        .limit(5);

    return results;
}
export async function createStudent(data: StudentInput) {
    await assertPermission('assistant'); // Assistant or Admin

    const validation = studentSchema.safeParse(data);
    if (!validation.success) return { success: false, error: "Data tidak valid" };

    const { name, level, subjects: subjectList, status } = validation.data;

    try {
        await db.transaction(async (tx) => {
            // 1. Create Student
            const [newStudent] = await tx.insert(students).values({
                name,
                level,
                status: status as any, // Drizzle enum type mismatch sometimes
                joinDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            }).returning();

            // 2. Add Subjects
            if (subjectList.length > 0) {
                await tx.insert(subjects).values(
                    subjectList.map(subj => ({
                        studentId: newStudent.id,
                        name: subj,
                        currentLevel: level, // Inherit student level initially
                    }))
                );
            }
        });

        revalidatePath("/admin/students");
        return { success: true, message: "Siswa berhasil ditambahkan" };
    } catch (error) {
        console.error("Create Student Error:", error);
        return { success: false, error: "Gagal menyimpan data ke database" };
    }
}

export async function deleteStudent(id: number) {
    await assertPermission('admin'); // Only Admin can delete

    try {
        await db.delete(students).where(eq(students.id, id));
        revalidatePath("/admin/students");
        return { success: true, message: "Siswa dihapus" };
    } catch (error) {
        return { success: false, error: "Gagal menghapus siswa" };
    }
}
