"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/actions/require-admin";
import { prisma } from "@/lib/prisma";

export async function markNotificationRead(id: string) {
  const actor = await requireAdmin();
  await prisma.notification.updateMany({
    where: { id, recipientAdminId: actor.id },
    data: { isRead: true, readAt: new Date() },
  });
  revalidatePath("/admin", "layout");
}

export async function markAllNotificationsRead() {
  const actor = await requireAdmin();
  await prisma.notification.updateMany({
    where: { recipientAdminId: actor.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  revalidatePath("/admin", "layout");
}

export async function deleteNotification(id: string) {
  const actor = await requireAdmin();
  await prisma.notification.deleteMany({ where: { id, recipientAdminId: actor.id } });
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/notifications");
}

export async function deleteAllReadNotifications() {
  const actor = await requireAdmin();
  await prisma.notification.deleteMany({ where: { recipientAdminId: actor.id, isRead: true } });
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/notifications");
}
