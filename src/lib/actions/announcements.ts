"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { logAudit } from "@/lib/audit";

const PATH = "/admin/announcements";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  message: z.string().trim().min(1, "Message is required."),
  icon: z.string().trim().optional(),
  buttonText: z.string().trim().optional(),
  buttonLink: z.string().trim().optional(),
  bgColor: z.string().trim().min(1),
  textColor: z.string().trim().min(1),
  priority: z.coerce.number().default(0),
  isEnabled: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  displayRule: z.enum(["ENTIRE_WEBSITE", "HOMEPAGE", "SELECTED_PAGES"]),
  selectedPages: z.string().optional(), // newline-separated paths
});

function parseFormData(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    message: formData.get("message"),
    icon: formData.get("icon") || undefined,
    buttonText: formData.get("buttonText") || undefined,
    buttonLink: formData.get("buttonLink") || undefined,
    bgColor: formData.get("bgColor") || "#1B4332",
    textColor: formData.get("textColor") || "#FFFFFF",
    priority: formData.get("priority") || 0,
    isEnabled: formData.get("isEnabled") === "on",
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    displayRule: formData.get("displayRule") || "ENTIRE_WEBSITE",
    selectedPages: formData.get("selectedPages") || undefined,
  });
}

function toSelectedPagesJson(raw?: string): string[] {
  if (!raw) return [];
  return raw.split("\n").map((l) => l.trim()).filter(Boolean);
}

export async function createAnnouncement(formData: FormData) {
  const actor = await requireSuperAdmin();
  const data = parseFormData(formData);
  const announcement = await prisma.announcement.create({
    data: {
      title: data.title,
      message: data.message,
      icon: data.icon || null,
      buttonText: data.buttonText || null,
      buttonLink: data.buttonLink || null,
      bgColor: data.bgColor,
      textColor: data.textColor,
      priority: data.priority,
      isEnabled: data.isEnabled,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      displayRule: data.displayRule,
      selectedPages: toSelectedPagesJson(data.selectedPages),
    },
  });

  await logAudit({
    actor,
    action: "ANNOUNCEMENT_CREATED",
    entityType: "Announcement",
    entityId: announcement.id,
    description: `${actor.name} created announcement "${announcement.title}".`,
  });

  revalidatePath(PATH);
  revalidatePath("/", "layout");
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const actor = await requireSuperAdmin();
  const data = parseFormData(formData);
  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title: data.title,
      message: data.message,
      icon: data.icon || null,
      buttonText: data.buttonText || null,
      buttonLink: data.buttonLink || null,
      bgColor: data.bgColor,
      textColor: data.textColor,
      priority: data.priority,
      isEnabled: data.isEnabled,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      displayRule: data.displayRule,
      selectedPages: toSelectedPagesJson(data.selectedPages),
    },
  });

  await logAudit({
    actor,
    action: "ANNOUNCEMENT_UPDATED",
    entityType: "Announcement",
    entityId: id,
    description: `${actor.name} updated announcement "${announcement.title}".`,
  });

  revalidatePath(PATH);
  revalidatePath("/", "layout");
}

export async function deleteAnnouncement(id: string) {
  const actor = await requireSuperAdmin();
  const announcement = await prisma.announcement.delete({ where: { id } });

  await logAudit({
    actor,
    action: "ANNOUNCEMENT_DELETED",
    entityType: "Announcement",
    entityId: id,
    description: `${actor.name} deleted announcement "${announcement.title}".`,
  });

  revalidatePath(PATH);
  revalidatePath("/", "layout");
}

export async function toggleAnnouncementEnabled(id: string, isEnabled: boolean) {
  const actor = await requireSuperAdmin();
  const announcement = await prisma.announcement.update({ where: { id }, data: { isEnabled } });

  await logAudit({
    actor,
    action: isEnabled ? "ANNOUNCEMENT_ENABLED" : "ANNOUNCEMENT_DISABLED",
    entityType: "Announcement",
    entityId: id,
    description: `${actor.name} ${isEnabled ? "enabled" : "disabled"} announcement "${announcement.title}".`,
  });

  revalidatePath(PATH);
  revalidatePath("/", "layout");
}

export async function archiveAnnouncement(id: string, isArchived: boolean) {
  const actor = await requireSuperAdmin();
  const announcement = await prisma.announcement.update({ where: { id }, data: { isArchived } });

  await logAudit({
    actor,
    action: isArchived ? "ANNOUNCEMENT_ARCHIVED" : "ANNOUNCEMENT_UNARCHIVED",
    entityType: "Announcement",
    entityId: id,
    description: `${actor.name} ${isArchived ? "archived" : "unarchived"} announcement "${announcement.title}".`,
  });

  revalidatePath(PATH);
  revalidatePath("/", "layout");
}

export async function duplicateAnnouncement(id: string) {
  const actor = await requireSuperAdmin();
  const original = await prisma.announcement.findUnique({ where: { id } });
  if (!original) return;

  const copy = await prisma.announcement.create({
    data: {
      title: `${original.title} (Copy)`,
      message: original.message,
      icon: original.icon,
      buttonText: original.buttonText,
      buttonLink: original.buttonLink,
      bgColor: original.bgColor,
      textColor: original.textColor,
      priority: original.priority,
      isEnabled: false,
      startDate: original.startDate,
      endDate: original.endDate,
      displayRule: original.displayRule,
      selectedPages: original.selectedPages ?? undefined,
    },
  });

  await logAudit({
    actor,
    action: "ANNOUNCEMENT_DUPLICATED",
    entityType: "Announcement",
    entityId: copy.id,
    description: `${actor.name} duplicated announcement "${original.title}".`,
  });

  revalidatePath(PATH);
}
