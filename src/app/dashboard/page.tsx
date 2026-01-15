import { auth } from "@/auth";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { getDashboardData, seedData } from "@/actions/billing";
import { AdminDashboardView } from "@/components/dashboard/admin-view";
import AssistantView from "@/components/dashboard/assistant-view";
import { FloatingActionButton } from "@/components/dashboard/fab";

export default async function DashboardPage(props: { searchParams: Promise<{ period?: string }> }) {
  const searchParams = await props.searchParams;
  const period = searchParams?.period || "current";
  const session = await auth();
  const role = session?.user?.role || "parent"; // Default to parent/assistant view if generic

  // Calculate Date
  const now = new Date();
  let targetDate = new Date(now.getFullYear(), now.getMonth(), 1);

  if (period === "prev") targetDate.setMonth(now.getMonth() - 1);
  if (period === "next") targetDate.setMonth(now.getMonth() + 1);

  const monthName = targetDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const paramMonth = `${String(targetDate.getMonth() + 1).padStart(2, '0')}-${targetDate.getFullYear()}`;

  // Fetch Data
  const { data, totalAmount } = await getDashboardData(paramMonth);

  // Data Mapping for Views
  const assistantData = data.map(d => ({
    id: d.id,
    name: d.studentName,
    level: d.level,
    subjects: d.subjects, // Pass subjects
    status: d.status === "PAID" ? "graded" : "pending" // Checkmark logic based on payment for now, or mock
  }));

  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center py-2">
          <div>
            <h1 className="text-xl font-bold text-[#005197]">{isAdmin ? "Admin Dashboard" : "Workbook Dashboard"}</h1>
            <div className="text-sm text-muted-foreground">{session?.user?.name || "User"}</div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:bg-destructive/10">
              Keluar
            </Button>
          </form>
        </header>

        {/* Role Based View */}
        {isAdmin ? (
          <AdminDashboardView
            totalAmount={totalAmount}
            studentCount={data.length}
            monthName={monthName}
          />
        ) : (
          <AssistantView
            students={assistantData}
            assistantId={session?.user?.id || ""}
          />
        )}

        {/* Seed Button (Dev Only - Admin) */}
        {isAdmin && data.length === 0 && (
          <form action={seedData} className="mt-8 text-center">
            <Button variant="outline" size="sm">Seed Dummy Data</Button>
            <p className="text-xs text-muted-foreground mt-2">Data kosong? Klik untuk isi data awal.</p>
          </form>
        )}
      </div>

      {/* FAB - Global for now, or ensure Assistant View has its own buttons (it does) */}
      <FloatingActionButton students={data.map(d => ({ id: d.id, name: d.studentName }))} />
    </main>
  );
}
