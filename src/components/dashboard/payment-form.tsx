"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { paymentSchema, PaymentInput } from "@/lib/schemas"
import { processPayment } from "@/actions/billing"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
    students: { id: number; name: string }[];
    onSuccess?: () => void;
}

export function PaymentForm({ students, onSuccess }: PaymentFormProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const form = useForm<PaymentInput>({
        resolver: zodResolver(paymentSchema) as any,
        defaultValues: {
            amount: 450000,
            monthYear: new Date().toISOString().slice(5, 7) + "-" + new Date().getFullYear(),
            paymentDate: new Date(),
        },
    })

    async function onSubmit(data: PaymentInput) {
        setIsPending(true);
        try {
            const result = await processPayment(data);
            if (result.success) {
                toast.success(result.message);
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                toast.error(typeof result.error === 'string' ? result.error : "Validation error");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Student Select */}
                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pilih Siswa</FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Cari nama siswa..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Month Selection (Simple Text for now, better with select) */}
                <FormField
                    control={form.control}
                    name="monthYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bulan (MM-YYYY)</FormLabel>
                            <FormControl>
                                <Input placeholder="01-2026" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Amount */}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jumlah Bayar</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-primary" disabled={isPending}>
                    {isPending ? "Memproses..." : "Simpan Pembayaran"}
                </Button>
            </form>
        </Form>
    )
}
