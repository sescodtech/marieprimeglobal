import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { EMAIL_TEMPLATE_KEYS, EMAIL_TEMPLATE_LABELS, type EmailTemplateKey } from "@/lib/emailTemplates";
import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/defaultEmailTemplates";
import { EmailTemplateEditor } from "@/components/admin/EmailTemplateEditor";

export default async function EmailTemplateEditPage({ params }: { params: Promise<{ key: string }> }) {
  await requirePermission(PERMISSIONS.MANAGE_EMAIL_TEMPLATES);
  const { key } = await params;

  if (!(EMAIL_TEMPLATE_KEYS as readonly string[]).includes(key)) notFound();
  const templateKey = key as EmailTemplateKey;

  const existing = await prisma.emailTemplate.findUnique({ where: { key: templateKey } });
  const defaults = DEFAULT_EMAIL_TEMPLATES[templateKey];

  return (
    <div className="max-w-2xl">
      <Link href="/admin/email-templates" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to Email Templates
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">{EMAIL_TEMPLATE_LABELS[templateKey]}</h1>

      <div className="mt-8 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-8">
        <EmailTemplateEditor
          templateKey={templateKey}
          defaultSubject={existing?.subject ?? defaults.subject}
          defaultBodyHtml={existing?.bodyHtml ?? defaults.bodyHtml}
        />
      </div>
    </div>
  );
}
