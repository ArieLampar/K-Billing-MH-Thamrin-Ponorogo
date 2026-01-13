import { HeroCard } from "@/components/dashboard/hero-card";
import { MonthNav } from "@/components/dashboard/month-nav";
import { PaymentTable } from "@/components/dashboard/payment-table";
import { FloatingActionButton } from "@/components/dashboard/fab";
import { getDashboardData, seedData } from "@/actions/billing";
import { Button } from "@/components/ui/button";

import { signOut } from "@/auth"; // Import signOut

export default async function DashboardPage(props: { searchParams: Promise<{ period?: string }> }) {
  const searchParams = await props.searchParams;
  const period = searchParams?.period || "current";

  // Calculate Date
  const now = new Date(); // In real app, consider timezone (WIB)
  let targetDate = new Date(now.getFullYear(), now.getMonth(), 1);

  if (period === "prev") targetDate.setMonth(now.getMonth() - 1);
  if (period === "next") targetDate.setMonth(now.getMonth() + 1);

  // Format for Display and API
  const monthName = targetDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const paramMonth = `${String(targetDate.getMonth() + 1).padStart(2, '0')}-${targetDate.getFullYear()}`;

  // Fetch Data
  const { data, totalAmount } = await getDashboardData(paramMonth);

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center py-2">
          <div>
            <h1 className="text-xl font-bold text-foreground">K-Billing</h1>
            <div className="text-sm text-muted-foreground">MH Thamrin</div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:bg-destructive/10">
              Keluar
            </Button>
          </form>
        </header>

        {/* Hero Card */}
        <HeroCard totalAmount={totalAmount} month={monthName} />

        {/* Navigation */}
        <MonthNav />

        {/* Content */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Daftar Tagihan</h2>
            <span className="text-sm text-muted-foreground">{data.length} Siswa</span>
          </div>
          <PaymentTable data={data} />

          {/* Seed Button (Dev Only) */}
          {data.length === 0 && (
            <form action={seedData} className="mt-8 text-center">
              <Button variant="outline" size="sm">Seed Dummy Data</Button>
              <p className="text-xs text-muted-foreground mt-2">Data kosong? Klik untuk isi data awal.</p>
            </form>
          )}
        </section>
      </div>

      {/* FAB */}
      <FloatingActionButton students={data.map(d => ({ id: d.id, name: d.studentName }))} />
    </main>
  );
}
