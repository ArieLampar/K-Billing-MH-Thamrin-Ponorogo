"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ImportPage() {
    return (
        <div className="space-y-6 container mx-auto p-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-[#005197]">Import Data Siswa</h1>

            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Perhatian</AlertTitle>
                <AlertDescription>
                    Pastikan format file sesuai dengan template. Import data akan mencocokkan data berdasarkan Email Orang Tua.
                </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Information Card */}
                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                            Format Template
                        </CardTitle>
                        <CardDescription>
                            Download template CSV/Excel untuk mempermudah.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2 border">
                            <p className="font-semibold text-slate-700">Kolom Wajib:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Nama Siswa</li>
                                <li>Level (Contoh: 3A, C, M)</li>
                                <li>Tanggal Lahir (YYYY-MM-DD)</li>
                                <li>Nama Orang Tua</li>
                                <li>Email Orang Tua (Wajib unik)</li>
                                <li>No WA (08xxx)</li>
                            </ul>
                        </div>

                        <a href="/template_siswa_kumon.csv" download className="block">
                            <Button variant="outline" className="w-full gap-2 border-green-200 hover:bg-green-50 text-green-700">
                                <Download className="h-4 w-4" />
                                Download Template CSV
                            </Button>
                        </a>
                    </CardContent>
                </Card>

                {/* Upload Card */}
                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-[#005197]" />
                            Upload File
                        </CardTitle>
                        <CardDescription>
                            Pilih file .CSV atau .XLSX untuk diproses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">Drag & drop file di sini</p>
                            <p className="text-xs text-muted-foreground mt-1">atau klik untuk browse</p>
                            <Input type="file" className="hidden" id="file-upload" accept=".csv, .xlsx" />
                            <Button variant="secondary" size="sm" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                                Pilih File
                            </Button>
                        </div>
                        <Button className="w-full bg-[#005197] hover:bg-[#003f75] h-11 rounded-lg">
                            Proses & Validasi File
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
