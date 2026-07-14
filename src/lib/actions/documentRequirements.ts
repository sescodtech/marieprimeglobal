"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { SERVICE_APPLICATION_CONFIGS } from "@/lib/applicationForms/config";
import type { ServiceApplicationType } from "@/lib/applicationForms/types";

const serviceTypeSchema = z.enum(Object.keys(SERVICE_APPLICATION_CONFIGS) as [ServiceApplicationType, ...ServiceApplicationType[]]);

function slugifyKey(name: string): string {
  const camel = name
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word, i) => (i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()))
    .join("");
  return camel || "document";
}

function path(serviceType: string) {
  return `/admin/application-forms/${serviceType}/documents`;
}

const requirementSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  description: z.string().trim().optional(),
  isRequired: z.boolean(),
  fileTypes: z.array(z.string()).min(1, "Choose at least one file type."),
  maxSizeMb: z.coerce.number().min(1).max(50),
  order: z.coerce.number().default(0),
});

export async function createDocumentRequirement(serviceType: string, formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const type = serviceTypeSchema.parse(serviceType);

  const parsed = requirementSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    isRequired: formData.get("isRequired") === "on",
    fileTypes: formData.getAll("fileTypes"),
    maxSizeMb: formData.get("maxSizeMb") || 8,
    order: formData.get("order") || 0,
  });

  // Auto-generate a stable docKey from the name, disambiguating if it
  // collides with one already used for this service.
  const baseKey = slugifyKey(parsed.name);
  let docKey = baseKey;
  let suffix = 2;
  while (await prisma.serviceDocumentRequirement.findUnique({ where: { serviceType_docKey: { serviceType: type, docKey } } })) {
    docKey = `${baseKey}${suffix}`;
    suffix += 1;
  }

  const requirement = await prisma.serviceDocumentRequirement.create({
    data: {
      serviceType: type,
      docKey,
      name: parsed.name,
      description: parsed.description || null,
      isRequired: parsed.isRequired,
      fileTypes: parsed.fileTypes.join(","),
      maxSizeMb: parsed.maxSizeMb,
      order: parsed.order,
    },
  });

  await logAudit({
    actor,
    action: "DOCUMENT_REQUIREMENT_CREATED",
    entityType: "ServiceDocumentRequirement",
    entityId: requirement.id,
    description: `${actor.name} added document requirement "${parsed.name}" to ${type}.`,
  });

  revalidatePath(path(type));
  revalidatePath(`/apply/[slug]`, "page");
}

export async function updateDocumentRequirement(id: string, formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);

  const existing = await prisma.serviceDocumentRequirement.findUnique({ where: { id } });
  if (!existing) return;

  const parsed = requirementSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    isRequired: formData.get("isRequired") === "on",
    fileTypes: formData.getAll("fileTypes"),
    maxSizeMb: formData.get("maxSizeMb") || 8,
    order: formData.get("order") || 0,
  });

  await prisma.serviceDocumentRequirement.update({
    where: { id },
    data: {
      name: parsed.name,
      description: parsed.description || null,
      isRequired: parsed.isRequired,
      fileTypes: parsed.fileTypes.join(","),
      maxSizeMb: parsed.maxSizeMb,
      order: parsed.order,
    },
  });

  await logAudit({
    actor,
    action: "DOCUMENT_REQUIREMENT_UPDATED",
    entityType: "ServiceDocumentRequirement",
    entityId: id,
    description: `${actor.name} updated document requirement "${parsed.name}" for ${existing.serviceType}.`,
  });

  revalidatePath(path(existing.serviceType));
  revalidatePath(`/apply/[slug]`, "page");
}

export async function seedDefaultDocumentRequirements(serviceType: string) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const type = serviceTypeSchema.parse(serviceType);

  const existingCount = await prisma.serviceDocumentRequirement.count({ where: { serviceType: type } });
  if (existingCount > 0) return; // already configured — don't overwrite

  const defaults = SERVICE_APPLICATION_CONFIGS[type].documents;
  await prisma.serviceDocumentRequirement.createMany({
    data: defaults.map((doc, i) => ({
      serviceType: type,
      docKey: doc.id,
      name: doc.label,
      description: doc.helpText ?? null,
      isRequired: doc.required ?? false,
      fileTypes: doc.accept,
      maxSizeMb: Math.round((doc.maxSizeBytes ?? 8 * 1024 * 1024) / (1024 * 1024)),
      order: i,
    })),
  });

  await logAudit({
    actor,
    action: "DOCUMENT_REQUIREMENTS_SEEDED",
    entityType: "ServiceDocumentRequirement",
    entityId: type,
    description: `${actor.name} loaded the default document list for ${type} so it could be edited.`,
  });

  revalidatePath(path(type));
}

export async function deleteDocumentRequirement(id: string) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const existing = await prisma.serviceDocumentRequirement.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.serviceDocumentRequirement.delete({ where: { id } });

  await logAudit({
    actor,
    action: "DOCUMENT_REQUIREMENT_DELETED",
    entityType: "ServiceDocumentRequirement",
    entityId: id,
    description: `${actor.name} removed document requirement "${existing.name}" from ${existing.serviceType}.`,
  });

  revalidatePath(path(existing.serviceType));
  revalidatePath(`/apply/[slug]`, "page");
}
