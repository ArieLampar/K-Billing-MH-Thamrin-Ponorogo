import { HeroCard } from "@/components/dashboard/hero-card";
import { MonthNav } from "@/components/dashboard/month-nav";
import { PaymentTable, PaymentRow } from "@/components/dashboard/payment-table";
import { FloatingActionButton } from "@/components/dashboard/fab";

// Dummy Data for Preview
const dummyData: PaymentRow[] = [
  { id: 1, studentName: "Arie", level: "3A", amount: 450000, status: "PAID", date: "2026-01-10" },
  { id: 2, studentName: "Budi", level: "D", amount: 500000, status: "UNPAID", date: "2026-01-25" },
  { id: 3, studentName: "Citra", level: "M", amount: 550000, status: "LATE", date: "2026-01-05" },
  { id: 4, studentName: "Doni", level: "J", amount: 600000, status: "PAID", date: "2026-01-12" },
];

export default async function DashboardPage(props: { searchParams: Promise<{ period?: string }> }) {
  const searchParams = await props.searchParams;
  const period = searchParams?.period || "current";
  const monthName = period === "current" ? "Januari 2026" : period === "prev" ? "Desember 2025" : "Februari 2026";
  const totalAmount = dummyData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center py-2">
          <h1 className="text-xl font-bold text-foreground">K-Billing</h1>
          <div className="text-sm text-muted-foreground">MH Thamrin</div>
        </header>

        {/* Hero Card */}
        <HeroCard totalAmount={totalAmount} month={monthName} />

        {/* Navigation */}
        <MonthNav />

        {/* Content */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Daftar Tagihan</h2>
            <span className="text-sm text-muted-foreground">{dummyData.length} Siswa</span>
          </div>
          <PaymentTable data={dummyData} />
        </section>
      </div>

      {/* FAB */}
      <FloatingActionButton />
    </main>
  );
}
