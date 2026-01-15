import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login | K-Billing",
    description: "Masuk ke sistem K-Billing Kumon MH Thamrin",
}

export default function LoginPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-primary">
                            Selamat Datang
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sistem K-Billing Kumon MH Thamrin Ponorogo
                        </p>
                    </div>
                    <LoginForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Dengan mengklik continue, Anda setuju dengan{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Terms
                        </a>{" "}
                        dan{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
