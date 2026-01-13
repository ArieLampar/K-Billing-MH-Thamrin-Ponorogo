import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/', // Root is now login page
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            // Admin Protection
            if (isOnAdmin) {
                if (isLoggedIn && auth?.user.role === 'admin') return true;
                return false; // Redirect unauthenticated or non-admin users
            }

            // Dashboard Protection
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page (/)
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
                session.user.role = token.role as "admin" | "parent";
            }
            return session;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
