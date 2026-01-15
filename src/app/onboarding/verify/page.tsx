"use client";

import { useActionState } from "react";
import { verifyManual } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyPage() {
    const [state, formAction, isPending] = useActionState(verifyManual, {});

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-sm shadow-xl rounded-[1.5rem] border-primary/10">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold text-primary">Verifikasi Data</CardTitle>
                    <CardDescription>
                        Kami tidak menemukan email Anda di database siswa. Silakan masukkan ID Siswa atau No. WA yang terdaftar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="identifier">ID Siswa / No. WA</Label>
                            <Input
                                id="identifier"
                                name="identifier"
                                placeholder="Contoh: 1001 atau 08123456789"
                                required
                            />
                        </div>

                        {state.error && (
                            <p className="text-sm text-destructive font-medium text-center bg-destructive/10 p-2 rounded-md">
                                {state.error}
                            </p>
                        )}

                        <Button type="submit" className="w-full rounded-full" disabled={isPending}>
                            {isPending ? "Memverifikasi..." : "Verifikasi Akun"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
