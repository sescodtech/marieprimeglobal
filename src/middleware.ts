import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// This is deliberately built from `authConfig` alone, NOT from the full
// `@/lib/auth` export. `@/lib/auth` pulls in bcryptjs and Prisma for the
// Credentials provider, and neither is safe to run in Vercel's Edge
// Runtime, which is what middleware always executes in. Keeping this
// import Edge-only is what makes deployment succeed reliably.
export default NextAuth(authConfig).auth;

// NOTE: this file MUST live at `src/middleware.ts` (not the project root)
// because this project uses a `src/` directory for `src/app`. Next.js only
// discovers middleware next to the app/pages directory it belongs to — a
// root-level middleware.ts in a src-based project is silently ignored.
export const config = {
  matcher: ["/admin/:path*"],
};
