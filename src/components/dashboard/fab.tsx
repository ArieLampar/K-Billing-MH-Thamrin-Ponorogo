"use client"

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PaymentForm } from "@/components/dashboard/payment-form";
import { useState } from "react";

interface FabProps {
    students: { id: number; name: string }[];
}

export function FloatingActionButton({ students }: FabProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95"
                    >
                        <Plus className="h-8 w-8" />
                        <span className="sr-only">Input Payment</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Input Pembayaran</DialogTitle>
                        <DialogDescription>
                            Masukkan data pembayaran siswa.
                        </DialogDescription>
                    </DialogHeader>
                    <PaymentForm students={students} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
