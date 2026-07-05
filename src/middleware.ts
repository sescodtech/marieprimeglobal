import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Admin routes that must stay reachable WITHOUT an active session — the
// login page itself, plus the forgot/reset-password flow. Everything else
// under /admin is a protected route.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicPath = isPublicAdminPath(pathname);

  // Any /admin/* route that isn't explicitly public requires a valid session.
  // No valid session -> always bounce to the login page. This is the single
  // gate that guarantees /admin can never be reached directly without auth.
  if (isAdminRoute && !isPublicPath && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already signed in? Don't show the login/forgot-password screens again —
  // send straight to the dashboard.
  if ((pathname === "/admin/login" || pathname.startsWith("/admin/forgot-password")) && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

// NOTE: this file MUST live at `src/middleware.ts` (not the project root)
// because this project uses a `src/` directory for `src/app`. Next.js only
// discovers middleware next to the app/pages directory it belongs to — a
// root-level middleware.ts in a src-based project is silently ignored,
// which was the cause of /admin being reachable with no auth check at all.
export const config = {
  matcher: ["/admin/:path*"],
};
