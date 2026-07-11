"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const remember = formData.get("remember") === "on";
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");

  if (!email || !password) {
    return { error: "Please enter both your email and password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      remember: remember ? "true" : "false",
      redirectTo: callbackUrl,
    });
  } catch (error) {
    // signIn() throws a special redirect error on SUCCESS to hand control
    // back to Next.js — that one must be allowed to propagate, not treated
    // as a login failure.
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      return { error: "Incorrect email or password. Please try again." };
    }
    console.error("[loginAction] Sign-in failed unexpectedly:", error);
    return { error: "Something went wrong while signing in. Please try again." };
  }

  return {};
}

export async function signOutAction() {
  try {
    const session = await auth();
    if (session?.user?.id) {
      await logAudit({
        actor: {
          id: session.user.id,
          name: session.user.name ?? "Unknown",
          email: session.user.email ?? "unknown",
          role: session.user.role,
        },
        action: "LOGOUT",
        entityType: "Admin",
        entityId: session.user.id,
        description: `${session.user.name ?? "A user"} signed out.`,
      });
    }
    await signOut({ redirectTo: "/admin/login" });
  } catch (error) {
    // signOut() intentionally throws a special "redirect" error to hand
    // control back to Next.js — let that one through. Anything else means
    // the sign-out itself failed, so fail safe to the login page instead of
    // leaving the user on a blank page or dead route.
    if (isRedirectError(error)) throw error;
    console.error("[signOutAction] Sign out failed:", error);
    redirect("/admin/login");
  }
}

type ForgotPasswordState = { error?: string; success?: boolean };

// Always returns a generic success message regardless of whether the email
// matches an account — this prevents the endpoint being used to enumerate
// which addresses have admin accounts.
export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin) {
    // Invalidate any older outstanding tokens for this account first, so
    // only the most recently requested link is ever valid.
    await prisma.passwordResetToken.deleteMany({ where: { adminId: admin.id } });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        token,
        adminId: admin.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
    const resetUrl = `${siteUrl}/admin/reset-password/${token}`;

    await sendPasswordResetEmail(admin.email, resetUrl);
  }

  return { success: true };
}

type ResetPasswordState = { error?: string; success?: boolean };

export async function resetPassword(
  token: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation don't match." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Please request a new one." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.admin.update({
      where: { id: resetToken.adminId },
      data: { passwordHash },
    }),
    // Mark used AND delete so the token can never be replayed, even if a
    // future code path forgets to check `usedAt`.
    prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  return { success: true };
}
