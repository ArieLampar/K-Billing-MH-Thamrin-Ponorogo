import { Users, Upload, FileBarChart, ChevronRight } from "lucide-react";
import Link from "next/link";

const MENU_ITEMS = [
    {
        title: "Data Siswa",
        icon: Users,
        href: "/dashboard/students",
        color: "bg-blue-100 text-blue-700",
    },
    {
        title: "Import Data",
        icon: Upload,
        href: "/dashboard/import",
        color: "bg-green-100 text-green-700",
    },
    {
        title: "Laporan",
        icon: FileBarChart,
        href: "/dashboard/reports",
        color: "bg-purple-100 text-purple-700",
    },
];

export function MenuGrid() {
    return (
        <div className="grid grid-cols-1 gap-4">
            {MENU_ITEMS.map((item) => (
                <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center p-4 bg-card rounded-[1.5rem] shadow-sm border hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className={`p-3 rounded-2xl ${item.color} mr-4`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">Kelola {item.title.toLowerCase()}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-50" />
                </Link>
            ))}
        </div>
    );
}
