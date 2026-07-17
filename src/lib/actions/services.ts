"use server";

import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const jsonArraySchema = z
  .string()
  .transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error("not an array");
      return parsed as Record<string, string>[];
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid list data" });
      return z.NEVER;
    }
  })
  .transform((rows) =>
    // Drop rows where every field is blank — avoids saving empty placeholder rows.
    rows.filter((row) => Object.values(row).some((v) => v && v.trim().length > 0))
  );

// Requirements are entered as one plain-language line per requirement,
// rather than a JsonListEditor row set — simpler to fill in and simpler to
// display to clients on the apply/info step.
const lineListSchema = z
  .string()
  .optional()
  .transform((val) => (val ?? "").split("\n").map((line) => line.trim()).filter(Boolean));

const serviceSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(2),
  routeCode: z.string().min(2),
  routeFrom: z.string().min(1),
  routeTo: z.string().min(1),
  summary: z.string().min(5),
  description: z.string().min(10),
  tagline: z.string().optional(),
  benefits: jsonArraySchema,
  process: jsonArraySchema,
  faqs: jsonArraySchema,
  requirements: lineListSchema,
  processingTime: z.string().optional(),
  applicationMode: z.enum(["APPLY_ONLY", "ENQUIRY_ONLY", "APPLY_AND_ENQUIRY", "HIDDEN"]).default("APPLY_ONLY"),
  status: z.enum(["ACTIVE", "CLOSED", "MAINTENANCE", "COMING_SOON"]).default("ACTIVE"),
  showApplyButton: z.boolean().default(true),
  showEnquiryButton: z.boolean().default(true),
  applyRedirect: z.enum(["CONTACT", "ENQUIRY", "SERVICE_DETAILS", "CUSTOM"]).default("SERVICE_DETAILS"),
  applyRedirectUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean(),
  isArchived: z.boolean(),
  order: z.coerce.number().default(0),
});

function parseFormData(formData: FormData) {
  return serviceSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    routeCode: formData.get("routeCode"),
    routeFrom: formData.get("routeFrom"),
    routeTo: formData.get("routeTo"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    tagline: formData.get("tagline") || undefined,
    benefits: formData.get("benefits") || "[]",
    process: formData.get("process") || "[]",
    faqs: formData.get("faqs") || "[]",
    requirements: formData.get("requirements") || "",
    processingTime: formData.get("processingTime") || undefined,
    applicationMode: formData.get("applicationMode") || "APPLY_ONLY",
    status: formData.get("status") || "ACTIVE",
    showApplyButton: formData.get("showApplyButton") === "on",
    showEnquiryButton: formData.get("showEnquiryButton") === "on",
    applyRedirect: formData.get("applyRedirect") || "SERVICE_DETAILS",
    applyRedirectUrl: formData.get("applyRedirectUrl") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    bannerUrl: formData.get("bannerUrl") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    isPublished: formData.get("isPublished") === "on",
    isArchived: formData.get("isArchived") === "on",
    order: formData.get("order") || 0,
  });
}

function revalidateServicePaths() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/apply");
  revalidatePath("/apply/[slug]", "page");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const data = parseFormData(formData);
  const service = await prisma.service.create({ data });
  await logAudit({
    actor,
    action: "SERVICE_CREATED",
    entityType: "Service",
    entityId: service.id,
    description: `${actor.name} created the "${service.title}" service.`,
  });
  revalidateServicePaths();
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const data = parseFormData(formData);
  const service = await prisma.service.update({ where: { id }, data });
  await logAudit({
    actor,
    action: "SERVICE_UPDATED",
    entityType: "Service",
    entityId: service.id,
    description: `${actor.name} updated the "${service.title}" service.`,
  });
  revalidateServicePaths();
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const service = await prisma.service.delete({ where: { id } });
  await logAudit({
    actor,
    action: "SERVICE_DELETED",
    entityType: "Service",
    entityId: id,
    description: `${actor.name} deleted the "${service.title}" service.`,
  });
  revalidateServicePaths();
}

export async function toggleServicePublished(id: string, isPublished: boolean) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const service = await prisma.service.update({ where: { id }, data: { isPublished } });
  await logAudit({
    actor,
    action: isPublished ? "SERVICE_PUBLISHED" : "SERVICE_UNPUBLISHED",
    entityType: "Service",
    entityId: id,
    description: `${actor.name} ${isPublished ? "published" : "unpublished"} "${service.title}".`,
  });
  revalidateServicePaths();
}

export async function toggleServiceArchived(id: string, isArchived: boolean) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const service = await prisma.service.update({ where: { id }, data: { isArchived } });
  await logAudit({
    actor,
    action: isArchived ? "SERVICE_ARCHIVED" : "SERVICE_UNARCHIVED",
    entityType: "Service",
    entityId: id,
    description: `${actor.name} ${isArchived ? "archived" : "unarchived"} "${service.title}".`,
  });
  revalidateServicePaths();
}
