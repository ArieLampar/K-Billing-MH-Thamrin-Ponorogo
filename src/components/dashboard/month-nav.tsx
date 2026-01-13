"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"

export function MonthNav() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get("period") || "current"

    const onTabChange = (value: string) => {
        // Navigate to the new period, preserving other params if needed
        router.push(`/?period=${value}`)
    }

    return (
        <div className="w-full flex justify-center my-4">
            <Tabs defaultValue={currentTab} value={currentTab} onValueChange={onTabChange} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3 rounded-full h-11">
                    <TabsTrigger value="prev" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground shadow-none">Bulan Lalu</TabsTrigger>
                    <TabsTrigger value="current" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground shadow-none">Bulan Ini</TabsTrigger>
                    <TabsTrigger value="next" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground shadow-none">Bulan Depan</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}
