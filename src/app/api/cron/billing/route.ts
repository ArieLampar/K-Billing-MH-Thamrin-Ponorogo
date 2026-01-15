import { generateMonthlyInvoices } from "@/lib/invoice-generator";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure this runs dynamically

export async function GET(request: Request) {
    // Basic security: Check for an Authorization header (CRON_SECRET)
    // In Vercel, this is automatically handled if you set the CRON_SECRET env var
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await generateMonthlyInvoices();

    return NextResponse.json(result);
}
