import { db } from "@/lib/drizzle";
import { invoices, students } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function generateMonthlyInvoices() {
    console.log("Starting monthly invoice generation...");

    // 1. Determine current month/year context
    // In a real Cron job, this runs on the 1st of the month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const dueDateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-10`; // Due date: 10th of current month
    const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    try {
        // 2. Fetch all ACTIVE students
        // 2. Fetch all ACTIVE students with Subjects
        const activeStudents = await db.query.students.findMany({
            where: eq(students.status, 'ACTIVE'),
            with: { subjects: true }
        });

        let generatedCount = 0;
        let skippedCount = 0;

        for (const student of activeStudents) {
            // 3. Check if an invoice already exists for this student for this month
            // We use a simplified check on dueDate string pattern for this MVP
            // Ideally, we'd store month/year as separate columns or use date truncation
            const existingInvoice = await db.select()
                .from(invoices)
                .where(and(
                    eq(invoices.studentId, student.id),
                    sql`${invoices.dueDate}::text LIKE ${monthStr + '%'}`
                ))
                .limit(1);

            if (existingInvoice.length > 0) {
                skippedCount++;
                continue;
            }

            // 4. Calculate Amount
            // Standard Kumon fee logic or retrieve from student record if variable
            // For now, hardcoded standard fee: 450,000 IDR per subject
            const feePerSubject = 450000;
            const totalAmount = student.subjects.length * feePerSubject;

            // 5. Create Invoice
            await db.insert(invoices).values({
                studentId: student.id,
                amount: totalAmount,
                dueDate: dueDateStr,
                status: 'UNPAID', // Draft state
            });
            generatedCount++;
        }

        console.log(`Invoice Generation Complete. Created: ${generatedCount}, Skipped: ${skippedCount}`);
        return { success: true, generated: generatedCount, skipped: skippedCount };

    } catch (error) {
        console.error("Failed to generate invoices:", error);
        return { success: false, error: "Internal Server Error" };
    }
}
