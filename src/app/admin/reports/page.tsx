import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, TrendingUp } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-6 container mx-auto p-6 max-w-6xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#005197]">Laporan Operasional</h1>
                <div className="text-sm text-muted-foreground">Periode: Februari 2025</div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue (Estimasi)</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 45.000.000</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                            +5.2% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-[#005197]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
                        <Users className="h-4 w-4 text-[#005197]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">405</div>
                        <p className="text-xs text-muted-foreground mt-1">98% Retention Rate</p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjek</CardTitle>
                        <BookOpen className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">650</div>
                        <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-amber-100 text-amber-800 px-1 rounded">Math 380</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Eng 270</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dummy Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Tren Pembayaran SPP</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-around gap-2 p-6 border-t bg-slate-50/50">
                        {/* CSS Bar Chart */}
                        {[
                            { h: 40, label: 'Agt' }, { h: 60, label: 'Sep' },
                            { h: 55, label: 'Okt' }, { h: 70, label: 'Nov' },
                            { h: 85, label: 'Des' }, { h: 90, label: 'Jan' }
                        ].map((d, i) => (
                            <div key={i} className="flex flex-col items-center group w-full">
                                <div
                                    className="w-8 md:w-10 bg-[#005197] rounded-t-lg group-hover:opacity-80 transition-all relative overflow-hidden"
                                    style={{ height: `${d.h}%` }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                                </div>
                                <span className="text-xs text-muted-foreground mt-2">{d.label}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Komposisi Level Siswa</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t bg-slate-50/50">
                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl font-bold text-[#005197]">60%</div>
                                <div className="text-sm text-muted-foreground">Junior (7A - A)</div>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl font-bold text-green-600">30%</div>
                                <div className="text-sm text-muted-foreground">Senior (B - O)</div>
                            </div>
                            <div className="col-span-2 p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl font-bold text-amber-500">10%</div>
                                <div className="text-sm text-muted-foreground">Completer</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sky-800 text-sm flex items-start gap-3">
                <TrendingUp className="h-5 w-5 mt-0.5" />
                <div>
                    <strong>Insight AI:</strong> Prediksi cashflow bulan depan menunjukkan tren positif. Disarankan untuk follow-up 45 siswa yang belum bayar sebelum tanggal 10.
                </div>
            </div>
        </div>
    )
}
