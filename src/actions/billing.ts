"use server";

import { db } from "@/lib/drizzle";
import { students, invoices, users, subjects } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import { paymentSchema, PaymentInput } from "@/lib/schemas";
import { auth } from "@/auth";

// Auditor: Duplication Check & Security
export async function processPayment(data: PaymentInput): Promise<{ success: true; message: string } | { success: false; error: string }> {
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
        // Transaction for atomicity
        return await db.transaction(async (tx) => {
            // 2. Find existing invoices for this student
            // We search for any invoice that matches the YYYY-MM pattern in its dueDate
            const existingInvoices = await tx.select().from(invoices)
                .where(and(
                    eq(invoices.studentId, studentId),
                    sql`${invoices.dueDate}::text LIKE ${targetDateStr + '%'}`
                ));

            const targetInvoice = existingInvoices[0]; // Assuming one invoice per month per student logic

            if (targetInvoice) {
                if (targetInvoice.status === "PAID") {
                    // DUPLICATION CHECK TRIGGERED
                    return { success: false, error: "Pembayaran untuk bulan ini sudah lunas." };
                }

                // Update existing UNPAID invoice
                await tx.update(invoices)
                    .set({
                        status: "PAID",
                        paymentDate: new Date(),
                        amount: amount
                    })
                    .where(eq(invoices.id, targetInvoice.id));

                // Revalidate
                revalidatePath("/");
                return { success: true, message: "Pembayaran berhasil diperbarui." };
            } else {
                // Create ad-hoc invoice (e.g. paying for future month or past without invoice)
                await tx.insert(invoices).values({
                    studentId,
                    amount,
                    dueDate: `${targetDateStr}-10`,
                    status: "PAID",
                    paymentDate: new Date(),
                });

                revalidatePath("/");
                return { success: true, message: "Pembayaran baru berhasil dicatat." };
            }
        });

    } catch (error) {
        console.error("Payment Error:", error);
        return { success: false, error: "Terjadi kesalahan sistem saat memproses pembayaran." };
    }
}

// Optimized for RSC with Caching
export const getMonthlyReport = unstable_cache(async (monthYear: string) => {
    // monthYear format: "MM-YYYY"
    const [month, year] = monthYear.split("-").map(Number);
    const targetPattern = `${year}-${String(month).padStart(2, '0')}`;

    console.log(`Fetching report for: ${targetPattern}`);

    const periodInvoices = await db.select().from(invoices)
        .where(sql`${invoices.dueDate}::text LIKE ${targetPattern + '%'}`);

    const totalRevenue = periodInvoices
        .filter(i => i.status === 'PAID')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const unpaidCount = periodInvoices.filter(i => i.status !== 'PAID').length;
    const paidCount = periodInvoices.filter(i => i.status === 'PAID').length;

    return {
        totalRevenue,
        unpaidCount,
        paidCount,
        totalInvoices: periodInvoices.length
    };
}, ["monthly-report"], { revalidate: 60 }); // Cache for 1 minute


export async function getDashboardData(monthYear: string) {
    const session = await auth();
    if (!session?.user) return { data: [], totalAmount: 0 };

    // Parsing "MM-YYYY" to Date range
    const [month, year] = monthYear.split("-").map(Number);
    const targetPattern = `${year}-${String(month).padStart(2, '0')}`;

    // Authorization Filter logic needs to be adapted for query builder if strictly filtering by SQL
    // OR we can fetch and filter in memory if dataset is small (K-Billing scale likely small < 1000 students)
    // However, let's try to stick to efficient args if possible.
    // Drizzle query builder 'where' accepts sql operators.

    const studentList = await db.query.students.findMany({
        where: (students, { eq }) => session.user.role === 'parent' ? eq(students.parentId, session.user.id!) : undefined,
        with: {
            subjects: true,
        }
    });

    if (studentList.length === 0) return { data: [], totalAmount: 0 };

    // Fetch invoices for this period
    // We can't easily join specific month invoice in 'with' relation filtering without complex sql operations in some ORMs
    // Keeping existing separate fetch for invoices is fine for performance here.
    const periodInvoices = await db.select().from(invoices)
        .where(sql`${invoices.dueDate}::text LIKE ${targetPattern + '%'}`);

    // Map data
    const data = studentList.map((s) => {
        const inv = periodInvoices.find(i => i.studentId === s.id);

        return {
            id: s.id,
            studentName: s.name,
            level: s.level || "-",
            subjects: s.subjects, // Pass subjects through
            amount: inv ? inv.amount : 0,
            status: (inv ? inv.status : "UNPAID") as "PAID" | "UNPAID" | "LATE",
            date: inv ? inv.dueDate : "-",
        };
    });

    const totalAmount = data.reduce((acc, curr) => (curr.status === "PAID" ? acc + curr.amount : acc), 0);

    return { data, totalAmount };
}

// ----------------------------------------------------------------------
// DATA SEEDER (DUMMY DATA)
// ----------------------------------------------------------------------
export async function seedDummyData() {
    const session = await auth();
    // Allow if admin OR if dev mode (no session check strictly for initial seed if generic)
    // But for safety let's assume we run this from a protected route or console.

    // Clear existing for clean slate? No, just append for safety or check empty.
    const existing = await db.select().from(students).limit(1);
    // if (existing.length > 0) return { success: false, message: "Data already exists" };

    const dummyParents = [
        { name: "Agus Santoso", email: "agus.demo@example.com", student: "Budi Santoso", level: "3A" },
        { name: "Ratna Sari", email: "ratna.demo@example.com", student: "Siti Aminah", level: "C" },
        { name: "Joko Wijaya", email: "joko.demo@example.com", student: "Andi Wijaya", level: "M" },
        { name: "Dewi Putri", email: "dewi.demo@example.com", student: "Maya Putri", level: "A1" },
        { name: "Eko Prasetyo", email: "eko.demo@example.com", student: "Rina Prasetyo", level: "B" },
    ];

    try {
        await db.transaction(async (tx) => {
            for (const p of dummyParents) {
                // 1. Create Parent User
                const [user] = await tx.insert(users).values({
                    name: p.name,
                    email: p.email,
                    role: 'parent',
                    emailVerified: new Date(),
                }).onConflictDoNothing().returning(); // Skip if email exists

                let parentId = user?.id;

                // If user existed, fetch ID (simplified logic)
                if (!parentId) {
                    const u = await tx.query.users.findFirst({ where: (users, { eq }) => eq(users.email, p.email) });
                    if (u) parentId = u.id;
                }

                if (parentId) {
                    // 2. Create Student
                    const [student] = await tx.insert(students).values({
                        name: p.student,
                        level: p.level,
                        parentId: parentId,
                        joinDate: new Date().toISOString().split('T')[0],
                        status: "ACTIVE",
                    }).returning();

                    // 3. Add Subjects (Link)
                    await tx.insert(subjects).values({
                        studentId: student.id,
                        name: "Math", // Default
                        currentLevel: p.level,
                    });
                }
            }
        });

        return { success: true, message: "5 Dummy Students & Parents seeded!" };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to seed data" };
    }
}

export async function seedData() {
    const existing = await db.select().from(students);
    if (existing.length > 0) return;

    const insertedStudents = await db.insert(students).values([
        { name: "Arie", level: "3A", status: "ACTIVE", joinDate: "2025-01-01" },
        { name: "Budi", level: "D", status: "ACTIVE", joinDate: "2025-01-05" },
        { name: "Citra", level: "M", status: "ACTIVE", joinDate: "2025-02-01" },
    ]).returning();

    const ids = insertedStudents.map(s => s.id);

    // Seed Invoices for Jan 2026
    await db.insert(invoices).values([
        { studentId: ids[0], amount: 450000, dueDate: "2026-01-10", status: "PAID", paymentDate: new Date() },
        { studentId: ids[1], amount: 500000, dueDate: "2026-01-10", status: "UNPAID" },
    ]);

    revalidatePath("/");
}
