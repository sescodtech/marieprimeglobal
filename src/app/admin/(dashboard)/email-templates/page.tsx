import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { EMAIL_TEMPLATE_KEYS, EMAIL_TEMPLATE_LABELS } from "@/lib/emailTemplates";

export default async function EmailTemplatesPage() {
  await requirePermission(PERMISSIONS.MANAGE_EMAIL_TEMPLATES);

  const templates = await prisma.emailTemplate.findMany();
  const templateKeys = new Set(templates.map((t) => t.key));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Email Templates</h1>
      <p className="mt-1 text-sm text-ink-500">
        Customize the emails sent for each event. Anything not customized uses the built-in default copy.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {EMAIL_TEMPLATE_KEYS.map((key) => (
          <Link
            key={key}
            href={`/admin/email-templates/${key}`}
            className="flex items-center justify-between gap-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 hover:shadow-stub"
          >
            <div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-forest-700" />
                <span className="font-display text-base font-semibold text-forest-900">{EMAIL_TEMPLATE_LABELS[key]}</span>
              </div>
              <p className="mt-1 text-xs text-ink-500">{templateKeys.has(key) ? "Customized" : "Using default"}</p>
            </div>
            <ArrowRight size={16} className="shrink-0 text-ink-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
