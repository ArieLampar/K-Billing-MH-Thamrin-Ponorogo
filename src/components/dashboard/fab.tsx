"use client"

import * as React from "react";
import { Plus, Camera, CreditCard, Sparkles, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "@/components/dashboard/payment-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FabProps {
    students: { id: number; name: string }[];
}

export function FloatingActionButton({ students }: FabProps) {
    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState<string | null>(null);
    const [caption, setCaption] = React.useState<string | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setCaption(null);
        }
    };

    const generateCaption = async () => {
        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setCaption("Laporan Siswa: Pembelajaran berlangsung lancar. Siswa fokus mengerjakan set C1. #Kumon #MHThamrin");
        setIsGenerating(false);
    };

    const copyToClipboard = () => {
        if (caption) {
            navigator.clipboard.writeText(caption);
            toast.success("Caption disalin!");
            setOpen(false);
            setTimeout(() => {
                setImage(null);
                setCaption(null);
            }, 500);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95"
                    >
                        <Plus className="h-8 w-8" />
                        <span className="sr-only">Menu Aksi</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-center">Aksi Cepat</DrawerTitle>
                        <DrawerDescription className="text-center">Pilih aksi yang ingin dilakukan.</DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pt-0">
                        <Tabs defaultValue="snap" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="snap">
                                    <Camera className="w-4 h-4 mr-2" />
                                    Snap
                                </TabsTrigger>
                                <TabsTrigger value="pay">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Bayar
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="snap" className="space-y-4 min-h-[300px]">
                                {!image ? (
                                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-muted/30">
                                        <label htmlFor="camera-input-fab" className="cursor-pointer flex flex-col items-center gap-4 p-8 w-full h-full justify-center">
                                            <div className="p-6 bg-primary/10 rounded-full animate-pulse">
                                                <Camera className="w-10 h-10 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-base font-semibold block text-foreground">Ambil Foto</span>
                                                <span className="text-xs text-muted-foreground">Kamera / Galeri</span>
                                            </div>
                                            <input
                                                id="camera-input-fab"
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black/5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={image} alt="Preview" className="object-contain w-full h-full" />
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-sm backdrop-blur-sm bg-white/50 hover:bg-white/80"
                                                onClick={() => setImage(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {!caption ? (
                                            <Button className="w-full h-12 text-base" onClick={generateCaption} disabled={isGenerating}>
                                                {isGenerating ? <span className="animate-spin mr-2">⏳</span> : <Sparkles className="w-5 h-5 mr-2" />}
                                                {isGenerating ? "Sedang Menganalisis..." : "Buat Caption AI"}
                                            </Button>
                                        ) : (
                                            <div className="bg-muted/50 p-4 rounded-xl space-y-3 border">
                                                <p className="text-sm italic text-foreground leading-relaxed">"{caption}"</p>
                                                <Button className="w-full h-12 text-base font-semibold" onClick={copyToClipboard}>
                                                    <Copy className="w-5 h-5 mr-2" />
                                                    Salin & Selesai
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="pay">
                                <div className="border rounded-xl p-4 bg-card shadow-sm">
                                    <PaymentForm students={students} onSuccess={() => setOpen(false)} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="p-4 pt-0">
                        <DrawerClose asChild>
                            <Button variant="ghost" className="w-full text-muted-foreground">Tutup</Button>
                        </DrawerClose>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
