"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { logAudit } from "@/lib/audit";

const POPUPS_PATH = "/admin/popups";

const popupSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  buttonText: z.string().trim().optional(),
  buttonLink: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  bgColor: z.string().trim().min(1),
  textColor: z.string().trim().min(1),
  isEnabled: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  popupType: z.enum([
    "PROMOTION",
    "NEWSLETTER",
    "TRAVEL_UPDATE",
    "VISA_UPDATE",
    "HOLIDAY_NOTICE",
    "INFORMATION",
    "GENERAL_ANNOUNCEMENT",
  ]),
  displayRule: z.enum(["ENTIRE_WEBSITE", "HOMEPAGE_ONLY", "SPECIFIC_PAGE", "SPECIFIC_SERVICE", "SPECIFIC_BLOG"]),
  displayTarget: z.string().trim().optional(),
  triggerRule: z.enum(["AFTER_SECONDS", "AFTER_SCROLL_PERCENT", "EXIT_INTENT", "FIRST_VISIT", "ONCE_PER_SESSION", "ALWAYS"]),
  triggerValue: z.coerce.number().min(0).default(5),
  order: z.coerce.number().default(0),
});

function parsePopupFormData(formData: FormData) {
  return popupSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    description: formData.get("description") || undefined,
    buttonText: formData.get("buttonText") || undefined,
    buttonLink: formData.get("buttonLink") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    bgColor: formData.get("bgColor") || "#0B0F1A",
    textColor: formData.get("textColor") || "#FFFFFF",
    isEnabled: formData.get("isEnabled") === "on",
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    popupType: formData.get("popupType") || "GENERAL_ANNOUNCEMENT",
    displayRule: formData.get("displayRule") || "ENTIRE_WEBSITE",
    displayTarget: formData.get("displayTarget") || undefined,
    triggerRule: formData.get("triggerRule") || "AFTER_SECONDS",
    triggerValue: formData.get("triggerValue") || 5,
    order: formData.get("order") || 0,
  });
}

export async function createPopup(formData: FormData) {
  const actor = await requireSuperAdmin();
  const data = parsePopupFormData(formData);
  const popup = await prisma.popup.create({
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  await logAudit({
    actor,
    action: "POPUP_CREATED",
    entityType: "Popup",
    entityId: popup.id,
    description: `${actor.name} created popup "${popup.title}".`,
  });

  revalidatePath(POPUPS_PATH);
  revalidatePath("/", "layout");
}

export async function updatePopup(id: string, formData: FormData) {
  const actor = await requireSuperAdmin();
  const data = parsePopupFormData(formData);
  const popup = await prisma.popup.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  await logAudit({
    actor,
    action: "POPUP_UPDATED",
    entityType: "Popup",
    entityId: id,
    description: `${actor.name} updated popup "${popup.title}".`,
  });

  revalidatePath(POPUPS_PATH);
  revalidatePath(`${POPUPS_PATH}/${id}`);
  revalidatePath("/", "layout");
}

export async function deletePopup(id: string) {
  const actor = await requireSuperAdmin();
  const popup = await prisma.popup.delete({ where: { id } });

  await logAudit({
    actor,
    action: "POPUP_DELETED",
    entityType: "Popup",
    entityId: id,
    description: `${actor.name} deleted popup "${popup.title}".`,
  });

  revalidatePath(POPUPS_PATH);
  revalidatePath("/", "layout");
}

export async function togglePopupEnabled(id: string, isEnabled: boolean) {
  const actor = await requireSuperAdmin();
  const popup = await prisma.popup.update({ where: { id }, data: { isEnabled } });

  await logAudit({
    actor,
    action: isEnabled ? "POPUP_ENABLED" : "POPUP_DISABLED",
    entityType: "Popup",
    entityId: id,
    description: `${actor.name} ${isEnabled ? "enabled" : "disabled"} popup "${popup.title}".`,
  });

  revalidatePath(POPUPS_PATH);
  revalidatePath("/", "layout");
}

export async function duplicatePopup(id: string) {
  const actor = await requireSuperAdmin();
  const original = await prisma.popup.findUnique({ where: { id } });
  if (!original) return;

  const copy = await prisma.popup.create({
    data: {
      title: `${original.title} (Copy)`,
      subtitle: original.subtitle,
      description: original.description,
      buttonText: original.buttonText,
      buttonLink: original.buttonLink,
      imageUrl: original.imageUrl,
      bgColor: original.bgColor,
      textColor: original.textColor,
      isEnabled: false,
      startDate: original.startDate,
      endDate: original.endDate,
      popupType: original.popupType,
      displayRule: original.displayRule,
      displayTarget: original.displayTarget,
      triggerRule: original.triggerRule,
      triggerValue: original.triggerValue,
      order: original.order,
    },
  });

  await logAudit({
    actor,
    action: "POPUP_DUPLICATED",
    entityType: "Popup",
    entityId: copy.id,
    description: `${actor.name} duplicated popup "${original.title}".`,
  });

  revalidatePath(POPUPS_PATH);
}
