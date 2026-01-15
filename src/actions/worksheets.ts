"use server";

import { db } from "@/lib/drizzle";
import { worksheetRecords } from "@/db/schema";
import { auth } from "@/auth";
import { worksheetSchema, WorksheetInput } from "@/lib/schemas";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function logWorksheet(data: WorksheetInput) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    // Assistant / Admin only? Or Parents too? Assumption: Assistant/Admin for now.
    // if (session.user.role === 'parent') return { success: false, error: "Access denied" };

    const validation = worksheetSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Data tidak valid" };
    }

    const { studentId, subjectId, type, media, pageCount, date, notes } = validation.data;

    // Duplication Check: Same Student, Same Subject, Same Date, Same Type?
    // User requirement: "mencegah data ganda di hari yang sama"
    const dateStr = date.toISOString().split('T')[0];

    try {
        const existing = await db.select().from(worksheetRecords).where(and(
            eq(worksheetRecords.studentId, studentId),
            eq(worksheetRecords.subjectId, subjectId),
            eq(worksheetRecords.type, type), // Allow Class AND Homework on same day? usually yes.
            sql`${worksheetRecords.date}::text = ${dateStr}`
        )).limit(1);

        if (existing.length > 0) {
            return { success: false, error: "Data worksheet ini sudah ada untuk hari tersebut." };
        }

        await db.insert(worksheetRecords).values({
            studentId,
            subjectId,
            assistantId: session.user.id,
            type,
            media,
            pageCount,
            date: dateStr, // store as string YYYY-MM-DD if schema is date type, drizzle handles it usually or we pass string
            notes,
        });

        revalidatePath("/assistant");
        return { success: true, message: "Worksheet berhasil dicatat" };
    } catch (error) {
        console.error("Log Worksheet Error:", error);
        return { success: false, error: "Gagal menyimpan data." };
    }
}
