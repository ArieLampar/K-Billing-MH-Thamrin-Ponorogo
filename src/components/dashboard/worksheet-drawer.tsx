"use client"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

interface WorksheetDrawerProps {
    studentName: string;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function WorksheetDrawer({ studentName, trigger, open, onOpenChange }: WorksheetDrawerProps) {
    const [type, setType] = useState("class");

    const handleSave = () => {
        toast.success(`Data worksheet ${studentName} berhasil disimpan!`);
        if (onOpenChange) onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Input Worksheet</DrawerTitle>
                    <DrawerDescription>
                        Input hasil pengerjaan untuk <strong>{studentName}</strong>
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <Label>Jenis Pengerjaan</Label>
                        <RadioGroup defaultValue="class" onValueChange={setType} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="class" id="class" className="peer sr-only" />
                                <Label
                                    htmlFor="class"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                                >
                                    <span className="text-lg font-bold">Kelas</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="pr" id="pr" className="peer sr-only" />
                                <Label
                                    htmlFor="pr"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                                >
                                    <span className="text-lg font-bold">PR</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Input id="level" placeholder="Ex: 3A" className="h-12 text-center text-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sheet">Lembar</Label>
                            <Input id="sheet" placeholder="Ex: 1-10" className="h-12 text-center text-lg" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Status Fisik</Label>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 h-10">Fisik</Button>
                            <Button variant="outline" className="flex-1 h-10">KC (Digital)</Button>
                        </div>
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSave} className="h-12 rounded-full text-base font-semibold">Simpan Data</Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className="h-12 rounded-full">Batal</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
