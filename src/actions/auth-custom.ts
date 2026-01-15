"use server";

import { db } from "@/lib/drizzle";
import { users, students } from "@/db/schema";
import { registerSchema, RegisterInput } from "@/lib/schemas";
import { signIn } from "@/auth";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

export async function registerParent(data: RegisterInput) {
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Data tidak valid" };
    }

    const { parentName, email, childName } = validation.data;

    try {
        // 1. Check if email already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser) {
            return { success: false, error: "Email sudah terdaftar. Silakan Login." };
        }

        // 2. Atomic Registration (User + Student)
        await db.transaction(async (tx) => {
            // Create User (Parent)
            const [newUser] = await tx.insert(users).values({
                name: parentName,
                email: email,
                role: 'parent', // STRICT: Force parent role
                emailVerified: new Date(), // Auto-verify for manual registration? Or pending? 
                // Context: Usually Magic Link handles verification. 
                // But if we create user first, Magic Link 'signIn' will find existing user and just log them in.
            }).returning();

            // Create Student (Linked)
            await tx.insert(students).values({
                name: childName,
                parentId: newUser.id,
                level: "Initial", // Placeholder
                joinDate: new Date().toISOString().split('T')[0],
                status: "ACTIVE",
            });
        });

        // 3. Initiate Login (Magic Link)
        // We return success here and let the client trigger signIn to avoid redirect issues in action
        // OR we can trigger signIn here but 'redirect: false' doesn't work well in server actions for initiation sometimes.
        // Better: Return success and let Client Component call signIn("resend", { email }) to send the link.

        return { success: true, message: "Pendaftaran berhasil! Cek email Anda untuk login." };

    } catch (error) {
        console.error("Register Error:", error);
        return { success: false, error: "Gagal memproses pendaftaran." };
    }
}
