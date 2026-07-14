"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

type FormState = { error?: string; success?: boolean };

export async function updateProfile(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in." };

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (name.length < 2) return { error: "Name is required." };

  await prisma.admin.update({ where: { id: session.user.id }, data: { name, phone: phone || null } });
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function updateProfilePicture(avatarUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.admin.update({ where: { id: session.user.id }, data: { avatarUrl } });
  revalidatePath("/admin/profile");
  revalidatePath("/", "layout");
}

/** Super Admin only, and only for their own account — changing someone
 *  else's login email is done via the existing Edit User flow instead. */
export async function updateOwnLoginEmail(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    return { error: "Only a Super Admin can change their login email." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return { error: "Enter a valid email address." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return { error: "Another account already uses that email address." };
  }

  const admin = await prisma.admin.update({ where: { id: session.user.id }, data: { email } });

  await logAudit({
    actor: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    action: "LOGIN_EMAIL_CHANGED",
    entityType: "Admin",
    entityId: admin.id,
    description: `${admin.name} changed their own login email.`,
  });

  revalidatePath("/admin/profile");
  return { success: true };
}

export async function updateOwnRecoveryEmail(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    return { error: "Only a Super Admin can change their recovery email." };
  }

  const recoveryEmail = String(formData.get("recoveryEmail") || "").trim().toLowerCase();
  await prisma.admin.update({ where: { id: session.user.id }, data: { recoveryEmail: recoveryEmail || null } });
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function changePassword(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not signed in." };
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation don't match." };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) {
    return { error: "Admin account not found." };
  }

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  return { success: true };
}
