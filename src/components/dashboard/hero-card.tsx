import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface HeroCardProps {
    totalAmount: number;
    month: string; // e.g., "Januari 2026"
}

export function HeroCard({ totalAmount, month }: HeroCardProps) {
    return (
        <Card className="rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg border-none">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium opacity-90">Total Penagihan {month}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold tracking-tight">
                    {formatCurrency(totalAmount)}
                </div>
                <p className="text-sm opacity-80 mt-1">Target 100% collect</p>
            </CardContent>
        </Card>
    );
}
