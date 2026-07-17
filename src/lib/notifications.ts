import { prisma } from "@/lib/prisma";
import { PERMISSIONS, hasGrantedPermission } from "@/lib/permissions";
import { getEffectivePermissions } from "@/lib/permissionGrants";

export type NotificationCategory =
  | "APPLICATIONS"
  | "ENQUIRIES"
  | "DOCUMENTS"
  | "NEWSLETTER"
  | "USERS"
  | "MEDIA"
  | "SETTINGS"
  | "SECURITY"
  | "AUDIT_LOGS"
  | "SYSTEM";

type CreateNotificationInput = {
  recipientAdminId: string;
  title: string;
  body: string;
  link?: string;
  category?: NotificationCategory;
};

/**
 * Creates a single in-app notification for one admin. Swallows its own
 * errors — a failed notification must never break the action that
 * triggered it (an application being saved, a status changing, etc.).
 */
export async function createNotification({
  recipientAdminId,
  title,
  body,
  link,
  category = "SYSTEM",
}: CreateNotificationInput) {
  try {
    await prisma.notification.create({
      data: { recipientAdminId, title, body, link, category, channel: "SYSTEM", status: "SENT", sentAt: new Date() },
    });
  } catch (error) {
    console.error("[notifications] failed to create notification (non-fatal):", error);
  }
}

/**
 * Fans a notification out to every active admin holding a given permission
 * — e.g. "notify everyone who can review applications" for a new
 * submission, without the caller needing to know who that is. Checks each
 * admin's real, current grants (Phase 3.5), not just their role's default.
 */
export async function notifyAdminsWithPermission(
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS],
  input: Omit<CreateNotificationInput, "recipientAdminId">
) {
  try {
    const admins = await prisma.admin.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, role: true },
    });
    const withPermissions = await Promise.all(
      admins.map(async (a) => ({ id: a.id, permissions: await getEffectivePermissions(a.id, a.role) }))
    );
    const recipients = withPermissions.filter((a) => hasGrantedPermission(a.permissions, permission));
    await Promise.all(recipients.map((admin) => createNotification({ ...input, recipientAdminId: admin.id })));
  } catch (error) {
    console.error("[notifications] failed to fan out notification (non-fatal):", error);
  }
}

/** Notifies every active Super Admin — used for Security/Audit/System
 *  events that are always Super-Admin-only, regardless of grants. */
export async function notifySuperAdmins(input: Omit<CreateNotificationInput, "recipientAdminId">) {
  try {
    const superAdmins = await prisma.admin.findMany({
      where: { status: "ACTIVE", role: "SUPER_ADMIN" },
      select: { id: true },
    });
    await Promise.all(superAdmins.map((admin) => createNotification({ ...input, recipientAdminId: admin.id })));
  } catch (error) {
    console.error("[notifications] failed to notify super admins (non-fatal):", error);
  }
}
