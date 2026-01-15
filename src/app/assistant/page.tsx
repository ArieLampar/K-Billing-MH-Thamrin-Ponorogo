"use server";

import { auth } from "@/auth";
import { db } from "@/lib/drizzle";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTeachingLevel } from "@/lib/utils";
import AssistantView from "@/components/dashboard/assistant-view";
import { redirect } from "next/navigation";

export default async function AssistantPage() {
    const session = await auth();
    if (!session?.user) return redirect("/");

    // Role check
    if (session.user.role !== 'assistant' && session.user.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">Akses Ditolak. Halaman ini khusus Asisten.</div>;
    }

    // Get Assistant's assigned level (Mock default to 'BAWAH' if null)
    // In schema users.teachingLevel is 'BAWAH' | 'TENGAH' | 'ATAS'
    const assistantLevel = session.user.teachingLevel || "BAWAH";

    // Fetch All Active Students
    // In a real large app, we would filter in SQL, but since we have getTeachingLevel logic on string, 
    // it's easier to fetch all active and filter in memory for now (assuming < 1000 students).
    // If strict SQL is needed, we need to map level strings to enums in DB.

    const allStudents = await db.query.students.findMany({
        where: eq(students.status, 'ACTIVE'),
        with: { subjects: true }
    });

    // Filter Logic
    const filteredStudents = allStudents.filter(s => {
        // If admin, show all?
        if (session.user.role === 'admin') return true;

        const sLevel = getTeachingLevel(s.level);
        return sLevel === assistantLevel;
    });

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold text-kumon-blue">Dashboard Asisten ({assistantLevel})</h1>
            <AssistantView
                students={filteredStudents}
                assistantId={session.user.id!}
            />
        </div>
    );
}
