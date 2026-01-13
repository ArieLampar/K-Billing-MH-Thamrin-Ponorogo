import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export type PaymentRow = {
    id: number
    studentName: string
    level: string
    amount: number
    status: "PAID" | "UNPAID" | "LATE"
    date: string // Due date or Payment date
}

interface PaymentTableProps {
    data: PaymentRow[]
}

export function PaymentTable({ data }: PaymentTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[40%]">Siswa</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Tagihan</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                Tidak ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium">
                                    {row.studentName}
                                    <div className="text-xs text-muted-foreground sm:hidden">{row.date}</div>
                                </TableCell>
                                <TableCell>{row.level}</TableCell>
                                <TableCell>{formatCurrency(row.amount)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge
                                        variant={row.status === "PAID" ? "default" : row.status === "LATE" ? "destructive" : "secondary"}
                                        className="rounded-full px-3"
                                    >
                                        {row.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
