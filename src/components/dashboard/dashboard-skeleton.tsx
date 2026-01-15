import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="container max-w-lg mx-auto p-4 space-y-6">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center py-2">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-16" />
                </div>

                {/* Hero/Stats Card Skeleton */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <Skeleton className="h-5 w-40 mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-48" />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation/Tabs Skeleton */}
                <div className="flex gap-2 overflow-hidden">
                    <Skeleton className="h-10 w-20 rounded-full" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                </div>

                {/* Content List Skeleton */}
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
