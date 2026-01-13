"use server";

import { db } from "@/lib/drizzle";
import { invoices, students } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { paymentSchema, PaymentInput } from "@/lib/schemas";

// Auditor: Duplication Check & Security
// Auditor: Duplication Check & Security
export async function processPayment(data: PaymentInput) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    // 1. Validation
    const validation = paymentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid data" };
    }

    const { studentId, amount, monthYear } = validation.data;
    const [month, year] = monthYear.split("-").map(Number);
    const targetDateStr = `${year}-${String(month).padStart(2, '0')}`;

    try {
        // 2. Find existing invoice for this period
        // Simple verification: check if dueDate starts with YYYY-MM
        // In real app: strict date comparison
        const existingInvoices = await db.select().from(invoices)
            .where(and(
                eq(invoices.studentId, studentId),
                // We need a way to filter by date part in Drizzle/Postgres
                // For now, fetching all student invoices and filtering in JS (Not optimal but safe for MVP)
                eq(invoices.studentId, studentId)
            ));

        const targetInvoice = existingInvoices.find(inv => inv.dueDate.startsWith(targetDateStr));

        if (targetInvoice) {
            if (targetInvoice.status === "PAID") {
                return { success: false, error: "Sudah lunas bulan ini" };
            }

            // Update
            await db.update(invoices)
                .set({ status: "PAID", paymentDate: new Date(), amount }) // Amount validation check needed
                .where(eq(invoices.id, targetInvoice.id));
        } else {
            // Create ad-hoc invoice (Late entry or advance)
            await db.insert(invoices).values({
                studentId,
                amount,
                dueDate: `${targetDateStr}-10`,
                status: "PAID",
                paymentDate: new Date(),
            });
        }

        // 4. Revalidate
        revalidatePath("/");

        return { success: true, message: "Pembayaran berhasil dicatat" };
    } catch (error) {
        console.error("Payment Error:", error);
        return { success: false, error: "Database Error" };
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

import { auth } from "@/auth";

export async function getDashboardData(monthYear: string) {
    const session = await auth();
    if (!session?.user) return { data: [], totalAmount: 0 }; // Or redirect

    // Parsing "MM-YYYY" to Date range
    const [month, year] = monthYear.split("-").map(Number);

    // Authorization Filter
    let studentFilters = undefined;
    if (session.user.role === 'parent') {
        // Ensure parentId matches user.id
        studentFilters = eq(students.parentId, session.user.id!);
    }

    // Fetch students based on role
    const studentList = await db.select().from(students).where(studentFilters);

    // Fetch invoices for this period (Audit: Could be optimized to only fetch relevant invoices)
    const periodInvoices = await db.select().from(invoices);

    // Map data
    const data = studentList.map((s) => {
        // Find invoice for this student in this month (simplified matching)
        const inv = periodInvoices.find(i => i.studentId === s.id && i.dueDate.includes(`${year}-${String(month).padStart(2, '0')}`));

        return {
            id: s.id,
            studentName: s.name,
            level: s.level,
            amount: inv ? inv.amount : 0,
            status: (inv ? inv.status : "UNPAID") as "PAID" | "UNPAID" | "LATE",
            date: inv ? inv.dueDate : "-",
        };
    });

    const totalAmount = data.reduce((acc, curr) => (curr.status === "PAID" ? acc + curr.amount : acc), 0);

    return { data, totalAmount };
}

export async function seedData() {
    const existing = await db.select().from(students);
    if (existing.length > 0) return;

    const insertedStudents = await db.insert(students).values([
        { name: "Arie", level: "3A", subjects: ["Math"], status: "ACTIVE", joinDate: "2025-01-01" },
        { name: "Budi", level: "D", subjects: ["English"], status: "ACTIVE", joinDate: "2025-01-05" },
        { name: "Citra", level: "M", subjects: ["Math", "English"], status: "ACTIVE", joinDate: "2025-02-01" },
    ]).returning();

    const ids = insertedStudents.map(s => s.id);

    // Seed Invoices for Jan 2026
    await db.insert(invoices).values([
        { studentId: ids[0], amount: 450000, dueDate: "2026-01-10", status: "PAID" },
        { studentId: ids[1], amount: 500000, dueDate: "2026-01-10", status: "UNPAID" },
    ]);

    revalidatePath("/");
}
