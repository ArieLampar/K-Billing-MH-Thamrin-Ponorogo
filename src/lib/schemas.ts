import { z } from "zod";

// Regex for MM-YYYY
const monthYearRegex = /^(0[1-9]|1[0-2])-\d{4}$/;

export const paymentSchema = z.object({
    studentId: z.number().int().positive(),
    amount: z.number().positive("Jumlah bayar harus positif"),
    monthYear: z.string().regex(monthYearRegex, "Format bulan salah (Gunakan MM-YYYY)"),
    paymentDate: z.date().default(() => new Date()), // Removed .optional() to simplify type, handled by default
});

export const studentSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    level: z.string().min(1, "Level wajib diisi"),
    subjects: z.array(z.string()).min(1, "Minimal satu subjek"),
    status: z.enum(["ACTIVE", "BREAK"]).default("ACTIVE"),
});

export const invoiceSchema = z.object({
    studentId: z.number().int(),
    amount: z.number().positive(),
    dueDate: z.string(), // ISO Date assumption
    status: z.enum(["PAID", "UNPAID", "LATE"]).default("UNPAID"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
