import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

// Admin routes that must stay reachable WITHOUT an active session — the
// login page itself, plus the forgot/reset-password flow. Everything else
// under /admin is a protected route.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

// IMPORTANT: this file must stay Edge-runtime-safe — no bcrypt, no Prisma,
// no providers. Middleware runs on Vercel's Edge Runtime, and importing a
// Node-only dependency (like bcryptjs) into it can cause Vercel's build to
// fail unpredictably during the "Deploying outputs" step, *after* the build
// itself already reported success — with no useful error message. The full
// config with the Credentials provider and bcrypt lives in `src/lib/auth.ts`
// instead, which only ever runs in the Node.js runtime (Server Actions, API
// routes) and is never imported by middleware.
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname, origin } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isPublicPath = isPublicAdminPath(pathname);

      // Any /admin/* route that isn't explicitly public requires a valid
      // session. No valid session -> always bounce to the login page. This
      // is the single gate that guarantees /admin can never be reached
      // directly without auth.
      if (isAdminRoute && !isPublicPath && !isLoggedIn) {
        const loginUrl = new URL("/admin/login", origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Already signed in? Don't show the login/forgot-password screens
      // again — send straight to the dashboard.
      if ((pathname === "/admin/login" || pathname.startsWith("/admin/forgot-password")) && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", origin));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
