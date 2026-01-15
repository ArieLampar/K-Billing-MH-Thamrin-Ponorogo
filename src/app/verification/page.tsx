import { VerificationForm } from "@/components/auth/verification-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Verifikasi | K-Billing",
    description: "Verifikasi akun anda untuk mengakses sistem.",
}

export default function VerificationPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-primary">
                            Verifikasi Akun
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kami tidak menemukan data siswa/orang tua yang sesuai dengan email Google Anda. Silakan verifikasi manual.
                        </p>
                    </div>
                    <VerificationForm />
                </div>
            </div>
        </div>
    )
}
