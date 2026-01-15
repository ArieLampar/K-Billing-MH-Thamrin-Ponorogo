import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function assertPermission(requiredRole: 'admin' | 'assistant') {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const start = performance.now();
    const userRole = session.user.role;

    if (requiredRole === 'admin') {
        if (userRole !== 'admin') {
            throw new Error("UNAUTHORIZED_ACCESS: Admin role required");
        }
    }

    if (requiredRole === 'assistant') {
        if (userRole !== 'admin' && userRole !== 'assistant') {
            throw new Error("UNAUTHORIZED_ACCESS: Assistant or Admin role required");
        }
    }
}

export async function getCurrentUser() {
    const session = await auth();
    return session?.user;
}
