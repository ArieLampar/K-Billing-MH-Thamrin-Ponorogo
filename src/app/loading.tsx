import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container max-w-lg mx-auto p-4 space-y-6">
                {/* Header */}
                <header className="flex justify-between items-center py-2">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-4 w-24 rounded-lg" />
                </header>

                {/* Hero Card */}
                <Skeleton className="h-48 w-full rounded-[2rem]" />

                {/* Nav */}
                <Skeleton className="h-12 w-full rounded-full" />

                {/* Table */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-32 rounded-lg" />
                        <Skeleton className="h-6 w-16 rounded-lg" />
                    </div>
                    <div className="border rounded-xl p-2 space-y-2 bg-card">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
