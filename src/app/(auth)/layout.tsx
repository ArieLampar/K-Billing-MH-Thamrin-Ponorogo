export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid place-items-center bg-sky-50 p-4">
            <main className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-[#005197] tracking-tight">Kumon MH Thamrin</h1>
                    <p className="text-sm text-muted-foreground">Gateway Digital Orang Tua</p>
                </div>
                {children}
            </main>
        </div>
    )
}
