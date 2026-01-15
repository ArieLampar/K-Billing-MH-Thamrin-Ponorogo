"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentInput } from "@/lib/schemas";
import { createStudent } from "@/actions/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StudentForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<StudentInput>({
        resolver: zodResolver(studentSchema) as any,
        defaultValues: {
            name: "",
            level: "",
            subjects: [],
            status: "ACTIVE",
        }
    });

    const onSubmit = async (data: StudentInput) => {
        setLoading(true);
        const result = await createStudent(data);
        setLoading(false);

        if (result.success) {
            toast.success(result.message);
            router.push("/admin/students");
        } else {
            toast.error(result.error);
        }
    };

    // Subject Toggles
    const availableSubjects = ["Math", "English", "EFL"];
    const currentSubjects = form.watch("subjects");

    const toggleSubject = (subj: string) => {
        const current = [...currentSubjects];
        if (current.includes(subj)) {
            form.setValue("subjects", current.filter(s => s !== subj));
        } else {
            form.setValue("subjects", [...current, subj]);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">

            <div className="space-y-2">
                <label className="text-sm font-medium">Nama Siswa</label>
                <Input {...form.register("name")} placeholder="Nama Lengkap" />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Level Awal</label>
                <Input {...form.register("level")} placeholder="Contoh: 3A" />
                {form.formState.errors.level && <p className="text-red-500 text-xs">{form.formState.errors.level.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Subjek</label>
                <div className="flex gap-2">
                    {availableSubjects.map((subj) => (
                        <button
                            key={subj}
                            type="button"
                            onClick={() => toggleSubject(subj)}
                            className={`px-3 py-1 text-sm rounded-full border transition-colors ${currentSubjects.includes(subj)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted"
                                }`}
                        >
                            {subj}
                        </button>
                    ))}
                </div>
                {form.formState.errors.subjects && <p className="text-red-500 text-xs">{form.formState.errors.subjects.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Menyimpan..." : "Simpan Siswa"}
            </Button>
        </form>
    );
}
