import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Session lifetime: 30 days if "Remember Me" was checked at login,
// otherwise 8 hours. `session.maxAge` below is the outer ceiling (30 days);
// the shorter expiry for non-"remembered" sessions is applied per-token in
// the jwt callback.
const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const DEFAULT_MAX_AGE = 8 * 60 * 60; // 8 hours

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: REMEMBER_ME_MAX_AGE },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const remember = credentials?.remember === "true";
        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        // Best-effort only — a failure here must never block a successful
        // login. Before this fix, an unhandled error from this write would
        // propagate out of authorize() and NextAuth would report it as a
        // generic "server configuration" problem instead of letting a
        // correct password actually sign the admin in.
        try {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          });
        } catch (error) {
          console.error("[auth] Failed to update lastLoginAt (non-fatal):", error);
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          rememberMe: remember,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.rememberMe = user.rememberMe;
        // Auth.js signs the JWT using this exp claim when present, so a
        // session without "Remember Me" checked expires in hours, not weeks.
        token.exp = Math.floor(Date.now() / 1000) + (user.rememberMe ? REMEMBER_ME_MAX_AGE : DEFAULT_MAX_AGE);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
