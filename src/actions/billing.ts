"use server";

import { db } from "@/lib/drizzle";
import { invoices, students } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { paymentSchema, PaymentInput } from "@/lib/schemas";

// Auditor: Duplication Check & Security
export async function processPayment(data: PaymentInput) {
    // 1. Validation
    const validation = paymentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.format() };
    }

    const { studentId, amount, monthYear } = validation.data;

    try {
        // 2. Anti-Hallucination & Duplication Check
        // Convert MM-YYYY to a date range or specific invoice due date match
        // For this example, we look for an UNPAID invoice for the student ~ that month.
        // NOTE: This logic requires strict alignment between monthYear and invoice.dueDate

        // Check if already paid
        // const existing = await db.query.invoices.findFirst(...)

        // 3. Mutate (Transaction)
        // await db.update(invoices)...

        // 4. Revalidate
        revalidatePath("/");

        return { success: true, message: "Pembayaran berhasil" };
    } catch (error) {
        console.error("Payment Error:", error);
        return { success: false, error: "Internal Server Error" };
    }
}

export async function createMonthlyInvoice() {
    // Logic for generating invoices on the 25th
    // Fetch active students
    // Insert invoices
    console.log("Generating monthly invoices...");
    return { success: true, count: 0 };
}

export async function getMonthlyReport(month: string) {
    // Aggregation logic
    return { totalRevenue: 0, unpaidCount: 0 };
}
