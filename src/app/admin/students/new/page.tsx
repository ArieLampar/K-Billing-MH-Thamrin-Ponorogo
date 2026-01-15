import { StudentForm } from "@/components/admin/student-form";

export default function NewStudentPage() {
    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Tambah Siswa Baru</h1>
            <div className="bg-card p-6 border rounded-lg shadow-sm">
                <StudentForm />
            </div>
        </div>
    );
}
