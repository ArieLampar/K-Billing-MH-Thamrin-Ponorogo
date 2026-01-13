import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/drizzle"
import { authConfig } from "./auth.config"
import { accounts, sessions, users, verificationTokens } from "@/db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    session: { strategy: "jwt" }, // Edge compatibility preference often leans to JWT
    providers: [
        Google,
        Resend({
            from: "no-reply@kumon-mhthamrin.com"
        })
    ],
})
