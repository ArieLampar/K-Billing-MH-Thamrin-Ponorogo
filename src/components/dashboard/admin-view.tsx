import { StatsCard } from "./stats-card";
import { MenuGrid } from "./menu-grid";
import { MonthNav } from "./month-nav";

interface AdminDashboardProps {
    totalAmount: number;
    studentCount: number; // Placeholder for now, can be worksheet count later if DB supports
    monthName: string;
}

export function AdminDashboardView({ totalAmount, studentCount, monthName }: AdminDashboardProps) {
    return (
        <div className="space-y-6">
            <StatsCard
                totalBilling={totalAmount}
                worksheetCount={studentCount * 4} // Dummy calc: avg 4 per student
                month={monthName}
            />

            <MonthNav />

            <div>
                <h2 className="text-lg font-semibold mb-3 px-1">Menu Utama</h2>
                <MenuGrid />
            </div>
        </div>
    );
}
