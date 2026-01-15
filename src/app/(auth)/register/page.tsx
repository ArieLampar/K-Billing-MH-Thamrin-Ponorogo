"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/schemas";
import { registerParent } from "@/actions/auth-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            parentName: "",
            email: "",
            childName: "",
        }
    });

    const onSubmit = async (data: RegisterInput) => {
        setLoading(true);
        const result = await registerParent(data);
        setLoading(false);

        if (result.success) {
            toast.success("Akun berhasil dibuat! Silakan cek email.");
            // Optional: Auto-login flow or redirect
            signIn("resend", { email: data.email, callbackUrl: "/dashboard" });
        } else {
            toast.error(result.error);
        }
    };

    return (
        <Card className="rounded-[2.5rem] shadow-xl border-none">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Pendaftaran Baru</CardTitle>
                <CardDescription>Daftarkan diri & anak Anda</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...form.register("parentName")}
                            placeholder="Nama Lengkap Orang Tua"
                            className="bg-white/50"
                        />
                        {form.formState.errors.parentName && <p className="text-red-500 text-xs">{form.formState.errors.parentName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...form.register("email")}
                            type="email"
                            placeholder="Email Aktif"
                            className="bg-white/50"
                        />
                        {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="h-px bg-border my-2" />
                        <label className="text-xs font-medium text-muted-foreground ml-1">Data Siswa</label>
                        <Input
                            {...form.register("childName")}
                            placeholder="Nama Lengkap Anak"
                            className="bg-white/50"
                        />
                        {form.formState.errors.childName && <p className="text-red-500 text-xs">{form.formState.errors.childName.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#005197] hover:bg-[#003f75] text-white rounded-full mt-4"
                        disabled={loading}
                    >
                        {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">Sudah punya akun? </span>
                    <Link href="/login" className="text-[#005197] font-medium hover:underline">
                        Login di sini
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
