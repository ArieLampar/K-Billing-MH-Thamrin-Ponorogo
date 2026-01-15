import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnOps = nextUrl.pathname.startsWith('/ops'); // Assistant/Admin area

            // Admin Protection
            if (isOnAdmin) {
                if (isLoggedIn && auth?.user.role === 'admin') return true;
                return false;
            }

            // Operations (Assistant) Protection
            if (isOnOps) {
                if (isLoggedIn && (auth?.user.role === 'admin' || auth?.user.role === 'assistant')) return true;
                return false;
            }

            // Dashboard Protection
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            }

            // Root Redirect (If logged in, go to dashboard)
            if (nextUrl.pathname === '/') {
                if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
        session({ session, user, token }) {
            if (session.user && token?.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token?.role) {
                session.user.role = token.role as "admin" | "assistant" | "parent";
            }
            return session;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
            }

            // SUPER ADMIN OVERRIDE
            // Force specific email to be admin regardless of DB state
            if (token.email === "arie.thamrin33@gmail.com") {
                token.role = "admin";
            }

            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
