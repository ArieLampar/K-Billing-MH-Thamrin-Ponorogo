"use server"

import { z } from "zod"

const verificationSchema = z.object({
    identifier: z.string().min(1, "Masukkan Nomor HP atau ID Siswa"),
})

export async function verifyUser(prevState: any, formData: FormData) {
    const identifier = formData.get("identifier") as string

    const validatedFields = verificationSchema.safeParse({ identifier })

    if (!validatedFields.success) {
        return {
            message: "Input tidak valid",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // TODO: Actual DB lookup logic
    // For now, simulate success if identifier is "123"
    // simulate failure otherwise

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (identifier === "08123456789" || identifier === "123123") {
        return {
            success: true,
            message: "Verifikasi berhasil! Mengalihkan...",
        }
    }

    return {
        success: false,
        message: "Data tidak ditemukan. Silakan hubungi admin.",
    }
}
