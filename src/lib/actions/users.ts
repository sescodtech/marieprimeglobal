"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, requireSuperAdmin } from "@/lib/actions/require-admin";
import { logAudit } from "@/lib/audit";
import { assignableRoles, canManageRole, PERMISSIONS, ALL_PERMISSIONS, type Permission } from "@/lib/permissions";
import { seedDefaultPermissions, setPermissions } from "@/lib/permissionGrants";
import { notifySuperAdmins, createNotification } from "@/lib/notifications";

const USERS_PATH = "/admin/users";

type FormState = { error?: string; success?: boolean };

const roleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]);

const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: roleSchema,
});

export async function createUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const { name, email, password, role } = parsed.data;

  const allowedRoles = assignableRoles(actor.role, actor.canManageAdmins);
  if (!allowedRoles.includes(role)) {
    return { error: "You don't have permission to assign that role." };
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email address already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.admin.create({
    data: { name, email, passwordHash, role, createdById: actor.id },
  });

  if (role === "ADMIN" || role === "STAFF") {
    await seedDefaultPermissions(created.id, role);
  }

  await logAudit({
    actor,
    action: "USER_CREATED",
    entityType: "Admin",
    entityId: created.id,
    description: `${actor.name} created a ${role.replace("_", " ").toLowerCase()} account for ${name} (${email}).`,
  });

  void notifySuperAdmins({
    title: role === "ADMIN" ? "Admin created" : "Staff created",
    body: `${actor.name} created a ${role.toLowerCase()} account for ${name} (${email}).`,
    link: `/admin/users/${created.id}`,
    category: "USERS",
  });

  revalidatePath(USERS_PATH);
  redirect(USERS_PATH);
}

const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  role: roleSchema,
});

export async function updateUser(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    return { error: "That user no longer exists." };
  }
  if (!canManageRole(actor.role, actor.canManageAdmins, target.role)) {
    return { error: "You don't have permission to edit this user." };
  }

  const parsed = updateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const { name, email, role } = parsed.data;

  const roleChanged = role !== target.role;
  if (roleChanged) {
    if (id === actor.id) {
      return { error: "You can't change your own role." };
    }
    const allowedRoles = assignableRoles(actor.role, actor.canManageAdmins);
    if (!allowedRoles.includes(role)) {
      return { error: "You don't have permission to assign that role." };
    }
    if (target.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
      const superAdminCount = await prisma.admin.count({ where: { role: "SUPER_ADMIN" } });
      if (superAdminCount <= 1) {
        return { error: "At least one Super Admin must remain. Assign another Super Admin first." };
      }
    }
  }

  if (email !== target.email) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return { error: "Another account already uses that email address." };
    }
  }

  await prisma.admin.update({ where: { id }, data: { name, email, role } });

  await logAudit({
    actor,
    action: roleChanged ? "ROLE_CHANGED" : "USER_UPDATED",
    entityType: "Admin",
    entityId: id,
    description: roleChanged
      ? `${actor.name} changed ${target.name}'s role from ${target.role} to ${role}.`
      : `${actor.name} updated details for ${target.name}.`,
  });

  revalidatePath(USERS_PATH);
  redirect(USERS_PATH);
}

export async function setUserStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);

  if (id === actor.id) {
    throw new Error("You can't suspend your own account.");
  }

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) return;

  if (!canManageRole(actor.role, actor.canManageAdmins, target.role)) {
    throw new Error("You don't have permission to change this user's status.");
  }

  if (status === "SUSPENDED" && target.role === "SUPER_ADMIN") {
    const activeSuperAdmins = await prisma.admin.count({ where: { role: "SUPER_ADMIN", status: "ACTIVE" } });
    if (activeSuperAdmins <= 1) {
      throw new Error("At least one active Super Admin must remain.");
    }
  }

  await prisma.admin.update({
    where: { id },
    data: { status, suspendedAt: status === "SUSPENDED" ? new Date() : null },
  });

  await logAudit({
    actor,
    action: status === "SUSPENDED" ? "USER_SUSPENDED" : "USER_ACTIVATED",
    entityType: "Admin",
    entityId: id,
    description: `${actor.name} ${status === "SUSPENDED" ? "suspended" : "reactivated"} ${target.name}'s account.`,
  });

  revalidatePath(USERS_PATH);
}

export async function deleteUser(id: string) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);

  if (id === actor.id) {
    throw new Error("You can't delete your own account.");
  }

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) return;

  if (!canManageRole(actor.role, actor.canManageAdmins, target.role)) {
    throw new Error("You don't have permission to delete this user.");
  }

  if (target.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.admin.count({ where: { role: "SUPER_ADMIN" } });
    if (superAdminCount <= 1) {
      throw new Error("At least one Super Admin must remain.");
    }
  }

  await prisma.admin.delete({ where: { id } });

  await logAudit({
    actor,
    action: "USER_DELETED",
    entityType: "Admin",
    entityId: id,
    description: `${actor.name} deleted ${target.name}'s (${target.email}) account.`,
  });

  revalidatePath(USERS_PATH);
}

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation don't match.",
    path: ["confirmPassword"],
  });

export async function resetUserPassword(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    return { error: "That user no longer exists." };
  }
  if (!canManageRole(actor.role, actor.canManageAdmins, target.role)) {
    return { error: "You don't have permission to reset this user's password." };
  }

  const parsed = resetPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.admin.update({ where: { id }, data: { passwordHash } });

  await logAudit({
    actor,
    action: "PASSWORD_RESET",
    entityType: "Admin",
    entityId: id,
    description: `${actor.name} reset the password for ${target.name}.`,
  });

  return { success: true };
}

/**
 * Super Admin only: replaces an ADMIN or STAFF account's entire permission
 * grant set. This is what makes permission changes take effect immediately
 * — the next request that account makes re-resolves its permissions from
 * the database, no redeploy or re-login required.
 */
export async function setUserPermissions(id: string, permissions: string[]) {
  const actor = await requireSuperAdmin();

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) return;
  if (target.role === "SUPER_ADMIN") return; // Super Admin is never grant-based

  const validPermissions = permissions.filter((p): p is Permission => (ALL_PERMISSIONS as string[]).includes(p));
  await setPermissions(id, validPermissions);

  await logAudit({
    actor,
    action: "PERMISSIONS_UPDATED",
    entityType: "Admin",
    entityId: id,
    description: `${actor.name} updated permissions for ${target.name}.`,
  });

  void createNotification({
    recipientAdminId: id,
    title: "Your permissions were updated",
    body: `${actor.name} changed what you can access. Refresh the page if something looks different.`,
    link: "/admin",
    category: "USERS",
  });

  revalidatePath(`${USERS_PATH}/${id}/permissions`);
}
export async function setCanManageAdmins(id: string, canManageAdmins: boolean) {
  const actor = await requireSuperAdmin();

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target || target.role !== "ADMIN") return;

  await prisma.admin.update({ where: { id }, data: { canManageAdmins } });

  await logAudit({
    actor,
    action: canManageAdmins ? "ADMIN_MANAGEMENT_GRANTED" : "ADMIN_MANAGEMENT_REVOKED",
    entityType: "Admin",
    entityId: id,
    description: `${actor.name} ${canManageAdmins ? "granted" : "revoked"} ${target.name}'s permission to manage other Admins.`,
  });

  revalidatePath(USERS_PATH);
}
