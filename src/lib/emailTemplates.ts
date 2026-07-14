import { prisma } from "@/lib/prisma";

export const EMAIL_TEMPLATE_KEYS = [
  "APPLICATION_RECEIVED",
  "APPLICATION_APPROVED",
  "APPLICATION_REJECTED",
  "DOCUMENTS_REQUESTED",
  "DOCUMENTS_RECEIVED",
  "ENQUIRY_RECEIVED",
  "NEWSLETTER",
  "PASSWORD_RESET",
] as const;

export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number];

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  APPLICATION_RECEIVED: "Application Received",
  APPLICATION_APPROVED: "Application Approved",
  APPLICATION_REJECTED: "Application Rejected",
  DOCUMENTS_REQUESTED: "Documents Requested",
  DOCUMENTS_RECEIVED: "Documents Received",
  ENQUIRY_RECEIVED: "Enquiry Received",
  NEWSLETTER: "Newsletter",
  PASSWORD_RESET: "Password Reset",
};

/** The variables each template is documented to support — shown as a
 *  reference in the admin editor. Not every send actually fills every one
 *  (e.g. a newsletter has no referenceNumber); unused ones are just left
 *  blank rather than causing an error. */
export const EMAIL_TEMPLATE_VARIABLES = [
  "{{clientName}}",
  "{{referenceNumber}}",
  "{{serviceName}}",
  "{{status}}",
  "{{companyName}}",
];

export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] ?? match);
}

/** Returns the Super-Admin-configured template for this key, or null if
 *  none has been set up yet — callers should fall back to their existing
 *  hardcoded copy in that case, exactly like ServiceDocumentRequirement. */
export async function getEmailTemplate(
  key: EmailTemplateKey
): Promise<{ subject: string; bodyHtml: string } | null> {
  const template = await prisma.emailTemplate.findUnique({ where: { key } });
  if (!template) return null;
  return { subject: template.subject, bodyHtml: template.bodyHtml };
}
