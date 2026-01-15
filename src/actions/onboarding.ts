"use server";

import { auth } from "@/auth";
import { db } from "@/lib/drizzle";
import { students, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for manual verification
const manualVerifySchema = z.object({
    identifier: z.string().min(1, "Wajib diisi"),
});

export type OnboardingState = {
    message?: string;
    error?: string;
    success?: boolean;
};

export async function checkUserMapping() {
    const session = await auth();
    if (!session?.user?.email) return { linked: false };

    // 1. Check if user is already linked
    // We can check if they have 'parent' role AND a student link in DB? 
    // Or just rely on the session role? 
    // Let's query DB to be safe.
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id!),
        with: {
            students: true
        }
    });

    if (user?.students.length && user.students.length > 0) {
        return { linked: true }; // Already has students linked
    }

    // 2. Try to match by Email
    const student = await db.query.students.findFirst({
        where: eq(students.email, session.user.email),
    });

    if (student) {
        // MATCH FOUND! Auto-link.
        await db.transaction(async (tx) => {
            // Link Student -> User
            await tx.update(students)
                .set({ parentId: session.user.id })
                .where(eq(students.id, student.id));

            // Link User -> Student (Primary Profile) & Set Role
            await tx.update(users)
                .set({
                    role: 'parent',
                    studentId: student.id
                })
                .where(eq(users.id, session.user.id!));
        });

        return { linked: true };
    }

    return { linked: false };
}

export async function verifyManual(prevState: OnboardingState, formData: FormData): Promise<OnboardingState> {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const rawInput = formData.get("identifier") as string;
    const validated = manualVerifySchema.safeParse({ identifier: rawInput });

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.identifier?.[0] || "Input tidak valid" };
    }

    const { identifier } = validated.data;
    const isNumeric = /^\d+$/.test(identifier);

    // Search by ID (if numeric) OR WhatsApp
    const student = await db.query.students.findFirst({
        where: or(
            isNumeric ? eq(students.id, parseInt(identifier)) : undefined,
            eq(students.whatsapp, identifier)
        ),
    });

    if (!student) {
        return { error: "Data siswa tidak ditemukan. Periksa ID atau No. WA." };
    }

    // Check if already claimed?
    if (student.parentId) {
        // Optional: Check if claimed by *this* user (re-claiming is fine)
        if (student.parentId !== session.user.id) {
            return { error: "Akun siswa ini sudah diklaim oleh user lain." };
        }
    }

    // Link Data
    await db.transaction(async (tx) => {
        await tx.update(students)
            .set({ parentId: session.user.id })
            .where(eq(students.id, student.id));

        await tx.update(users)
            .set({
                role: 'parent',
                studentId: student.id
            })
            .where(eq(users.id, session.user.id!));
    });

    redirect("/dashboard");
}
