import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

// Session lifetime: 30 days if "Remember Me" was checked at login,
// otherwise 8 hours. `session.maxAge` below is the outer ceiling (30 days);
// the shorter expiry for non-"remembered" sessions is applied per-token in
// the jwt callback.
const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const DEFAULT_MAX_AGE = 8 * 60 * 60; // 8 hours

// This file is the full config — Credentials provider, bcrypt, Prisma — and
// must only ever run in the Node.js runtime (Server Actions, Route
// Handlers). It is never imported by middleware; see `auth.config.ts` for
// the Edge-safe subset that middleware uses instead.
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: REMEMBER_ME_MAX_AGE },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const remember = credentials?.remember === "true";
        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        // A suspended account must never be able to sign in again, even with
        // the correct password — this is what makes suspension immediate.
        if (admin.status === "SUSPENDED") return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          // Best-effort only — a failed login must still resolve to "no
          // access" even if logging/notifying it has a problem.
          try {
            const ipAddress =
              request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
              request?.headers.get("x-real-ip") ||
              null;
            const userAgent = request?.headers.get("user-agent") || null;
            await prisma.auditLog.create({
              data: {
                actorId: admin.id,
                actorName: admin.name,
                actorEmail: admin.email,
                actorRole: admin.role,
                action: "LOGIN_FAILED",
                entityType: "Admin",
                entityId: admin.id,
                description: `Failed login attempt for ${admin.email}.`,
                ipAddress,
                userAgent,
              },
            });
            const superAdmins = await prisma.admin.findMany({
              where: { status: "ACTIVE", role: "SUPER_ADMIN" },
              select: { id: true },
            });
            await Promise.all(
              superAdmins.map((sa) =>
                prisma.notification.create({
                  data: {
                    recipientAdminId: sa.id,
                    title: "Failed login attempt",
                    body: `A failed login attempt was made for ${admin.email}${ipAddress ? ` from ${ipAddress}` : ""}.`,
                    category: "SECURITY",
                    channel: "SYSTEM",
                    status: "SENT",
                    sentAt: new Date(),
                  },
                })
              )
            );
          } catch (error) {
            console.error("[auth] failed to record failed login attempt (non-fatal):", error);
          }
          return null;
        }

        // Best-effort only — a failure here must never block a successful
        // login.
        try {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          });
        } catch (error) {
          console.error("[auth] Failed to update lastLoginAt (non-fatal):", error);
        }

        // Audit trail for logins. Uses the raw request headers (rather than
        // the audit.ts/next-headers helper) because `request` here is the
        // actual incoming Request object NextAuth hands to Credentials
        // providers — the most reliable source of IP/UA at this point in the
        // auth flow. Best-effort only, same as above.
        try {
          const ipAddress =
            request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request?.headers.get("x-real-ip") ||
            null;
          const userAgent = request?.headers.get("user-agent") || null;
          await prisma.auditLog.create({
            data: {
              actorId: admin.id,
              actorName: admin.name,
              actorEmail: admin.email,
              actorRole: admin.role,
              action: "LOGIN",
              entityType: "Admin",
              entityId: admin.id,
              description: `${admin.name} signed in.`,
              ipAddress,
              userAgent,
            },
          });
        } catch (error) {
          console.error("[auth] Failed to record login audit log (non-fatal):", error);
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
    ...authConfig.callbacks,
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
