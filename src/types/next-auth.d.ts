// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id?: string
            role?: "admin" | "assistant" | "parent"
            teachingLevel?: "BAWAH" | "TENGAH" | "ATAS" | null // New
        } & DefaultSession["user"]
    }

    interface User {
        role?: "admin" | "assistant" | "parent"
        teachingLevel?: "BAWAH" | "TENGAH" | "ATAS" | null // New
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "admin" | "assistant" | "parent"
        teachingLevel?: "BAWAH" | "TENGAH" | "ATAS" | null // New
    }
}
