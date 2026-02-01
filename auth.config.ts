import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminDashboard = nextUrl.pathname.startsWith("/admin");
            const isDashboard = nextUrl.pathname.startsWith("/dashboard");

            if (isAdminDashboard) {
                // @ts-ignore
                if (isLoggedIn && auth?.user?.role === "ADMIN") return true;
                return false;
            }

            if (isDashboard) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
