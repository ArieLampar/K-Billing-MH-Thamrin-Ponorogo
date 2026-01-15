"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyUser } from "@/actions/verification"
import { useActionState } from "react"
import { toast } from "sonner"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function VerificationForm() {
    const [state, formAction, isPending] = useActionState(verifyUser, null)
    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message)
            setTimeout(() => {
                router.push("/dashboard")
            }, 1500)
        } else if (state?.message) {
            toast.error(state.message)
        }
    }, [state, router])

    return (
        <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="identifier">Nomor HP / ID Siswa</Label>
                <Input
                    id="identifier"
                    name="identifier"
                    placeholder="Contoh: 08123456789"
                    className="h-12 text-lg"
                    required
                />
                {state?.errors?.identifier && (
                    <p className="text-sm text-destructive">{state.errors.identifier[0]}</p>
                )}
            </div>
            <Button
                type="submit"
                className="h-12 w-full text-base font-semibold rounded-full bg-primary hover:bg-primary/90"
                disabled={isPending}
            >
                {isPending ? "Memverifikasi..." : "Verifikasi Data"}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
                Jika mengalami kendala, silakan hubungi Admin Kumon MH Thamrin.
            </p>
        </form>
    )
}
