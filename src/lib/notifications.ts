import { prisma } from "@/lib/prisma";
import { PERMISSIONS, hasGrantedPermission } from "@/lib/permissions";
import { getEffectivePermissions } from "@/lib/permissionGrants";

type CreateNotificationInput = {
  recipientAdminId: string;
  title: string;
  body: string;
  link?: string;
};

/**
 * Creates a single in-app notification for one admin. Swallows its own
 * errors — a failed notification must never break the action that
 * triggered it (an application being saved, a status changing, etc.).
 */
export async function createNotification({ recipientAdminId, title, body, link }: CreateNotificationInput) {
  try {
    await prisma.notification.create({
      data: { recipientAdminId, title, body, link, channel: "SYSTEM", status: "SENT", sentAt: new Date() },
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
