import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FileText, Wallet } from "lucide-react";

interface StatsCardProps {
    totalBilling: number;
    worksheetCount: number;
    month: string;
}

export function StatsCard({ totalBilling, worksheetCount, month }: StatsCardProps) {
    return (
        <Card className="rounded-[2.5rem] bg-gradient-to-br from-[#005197] to-[#003f75] text-white shadow-xl border-none overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none" />

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Monitoring {month}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
                <div>
                    <p className="text-sm opacity-70 mb-1">Total Penagihan</p>
                    <div className="text-3xl font-bold tracking-tight">
                        {formatCurrency(totalBilling)}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                    <div className="bg-white/10 p-2 rounded-xl">
                        <FileText className="w-5 h-5 text-blue-100" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold leading-none">{worksheetCount}</div>
                        <p className="text-xs opacity-70">Worksheet Terkumpul</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
