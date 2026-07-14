"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { EMAIL_TEMPLATE_KEYS, EMAIL_TEMPLATE_LABELS, type EmailTemplateKey } from "@/lib/emailTemplates";
import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/defaultEmailTemplates";

type FormState = { error?: string; success?: boolean };

export async function updateEmailTemplate(key: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const actor = await requirePermission(PERMISSIONS.MANAGE_EMAIL_TEMPLATES);

  if (!(EMAIL_TEMPLATE_KEYS as readonly string[]).includes(key)) {
    return { error: "Unknown template." };
  }
  const templateKey = key as EmailTemplateKey;

  const subject = String(formData.get("subject") || "").trim();
  const bodyHtml = String(formData.get("bodyHtml") || "").trim();
  if (!subject || !bodyHtml) return { error: "Subject and body are both required." };

  await prisma.emailTemplate.upsert({
    where: { key: templateKey },
    update: { subject, bodyHtml },
    create: { key: templateKey, name: EMAIL_TEMPLATE_LABELS[templateKey], subject, bodyHtml },
  });

  await logAudit({
    actor,
    action: "EMAIL_TEMPLATE_UPDATED",
    entityType: "EmailTemplate",
    entityId: templateKey,
    description: `${actor.name} updated the "${EMAIL_TEMPLATE_LABELS[templateKey]}" email template.`,
  });

  revalidatePath("/admin/email-templates");
  return { success: true };
}

/** Materializes the built-in default copy into an editable DB row, same
 *  pattern as seedDefaultDocumentRequirements — safe to call even if a
 *  template already exists (it just gets overwritten back to the default,
 *  which is the expected "reset to default" behavior here). */
export async function resetEmailTemplateToDefault(key: string) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_EMAIL_TEMPLATES);
  if (!(EMAIL_TEMPLATE_KEYS as readonly string[]).includes(key)) return;
  const templateKey = key as EmailTemplateKey;
  const defaults = DEFAULT_EMAIL_TEMPLATES[templateKey];

  await prisma.emailTemplate.upsert({
    where: { key: templateKey },
    update: { subject: defaults.subject, bodyHtml: defaults.bodyHtml },
    create: { key: templateKey, name: EMAIL_TEMPLATE_LABELS[templateKey], ...defaults },
  });

  await logAudit({
    actor,
    action: "EMAIL_TEMPLATE_RESET",
    entityType: "EmailTemplate",
    entityId: templateKey,
    description: `${actor.name} reset the "${EMAIL_TEMPLATE_LABELS[templateKey]}" email template to its default.`,
  });

  revalidatePath("/admin/email-templates");
}
