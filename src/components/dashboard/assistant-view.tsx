"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { worksheetSchema, WorksheetInput } from "@/lib/schemas";
import { logWorksheet } from "@/actions/worksheets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type PropType = {
    students: any[]; // Extended type with subjects
    assistantId: string;
};

export default function AssistantView({ students, assistantId }: PropType) {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    // Derived state for the selected student's subjects
    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const availableSubjects = selectedStudent?.subjects || [];

    const form = useForm<WorksheetInput>({
        resolver: zodResolver(worksheetSchema) as any,
        defaultValues: {
            studentId: 0,
            subjectId: 0,
            type: "CLASS",
            media: "PHYSICAL",
            pageCount: 0,
            date: new Date(),
            notes: ""
        }
    });

    const onSubmit = async (data: WorksheetInput) => {
        const result = await logWorksheet(data);
        if (result.success) {
            toast.success(result.message);
            form.reset({
                studentId: data.studentId, // Keep student selected
                subjectId: data.subjectId, // Keep subject selected
                type: "CLASS",
                media: "PHYSICAL",
                pageCount: 0,
                date: new Date(),
                notes: ""
            });
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Input Worksheet Harian</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Student Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pilih Siswa</label>
                            <Select
                                onValueChange={(val) => {
                                    const id = parseInt(val);
                                    setSelectedStudentId(id);
                                    form.setValue("studentId", id);
                                    form.setValue("subjectId", 0); // Reset subject
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Cari Siswa..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name} ({s.level || "N/A"})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.studentId && <p className="text-red-500 text-xs text-right">Wajib pilih siswa</p>}
                        </div>

                        {/* Subject Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subjek</label>
                            <Select
                                disabled={availableSubjects.length === 0}
                                onValueChange={(val) => form.setValue("subjectId", parseInt(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={availableSubjects.length === 0 ? "Pilih Siswa Dulu" : "Pilih Subjek"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSubjects.map((subj: any) => (
                                        <SelectItem key={subj.id} value={subj.id.toString()}>
                                            {subj.name} ({subj.currentLevel})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.subjectId && <p className="text-red-500 text-xs text-right">Wajib pilih subjek</p>}
                        </div>

                        {/* Type & Media Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipe</label>
                                <Select
                                    defaultValue="CLASS"
                                    onValueChange={(val) => form.setValue("type", val as "CLASS" | "HOMEWORK")}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CLASS">Kelas (Class)</SelectItem>
                                        <SelectItem value="HOMEWORK">PR (Homework)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Media</label>
                                <Select
                                    defaultValue="PHYSICAL"
                                    onValueChange={(val) => form.setValue("media", val as "PHYSICAL" | "TABLET")}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PHYSICAL">Fisik (Kertas)</SelectItem>
                                        <SelectItem value="TABLET">Tablet (KC)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Page Count */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jumlah Halaman</label>
                            <Input
                                type="number"
                                {...form.register("pageCount", { valueAsNumber: true })}
                                placeholder="0"
                            />
                            {form.formState.errors.pageCount && <p className="text-red-500 text-xs">{form.formState.errors.pageCount.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {/* Placeholder for Recent Activity or Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistik Harian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Anda telah menginput X lembar kerja hari ini.</p>
                        {/* Can fetch this via server action or prop later */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
