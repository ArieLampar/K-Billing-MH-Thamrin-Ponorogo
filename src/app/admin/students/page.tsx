import { db } from "@/lib/drizzle";
import { students } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function AdminStudentsPage() {
    // Fetch students sorted by creation date
    const studentList = await db.select().from(students).orderBy(desc(students.createdAt));

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#005197]">Data Siswa</h1>
                    <p className="text-muted-foreground">Kelola data seluruh siswa aktif & alumni.</p>
                </div>
                <Link href="/admin/students/new">
                    <Button className="bg-[#005197] hover:bg-[#003f75] rounded-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Siswa
                    </Button>
                </Link>
            </div>

            {/* Filter Bar (Visual Only for now) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama siswa..." className="pl-9 bg-slate-50 border-none" />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#005197]/5 text-[#005197] font-semibold border-b">
                        <tr>
                            <th className="px-6 py-4">Nama Lengkap</th>
                            <th className="px-6 py-4">Level</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Tanggal Bergabung</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {studentList.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{student.name}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 font-bold text-xs">
                                        {student.level || "-"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                            student.status === 'GRADUATED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{student.joinDate}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="text-[#005197]">Detail</Button>
                                </td>
                            </tr>
                        ))}
                        {studentList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    <p>Belum ada data siswa.</p>
                                    <Link href="/admin/import" className="text-[#005197] hover:underline mt-2 inline-block">
                                        Import dari Excel?
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
