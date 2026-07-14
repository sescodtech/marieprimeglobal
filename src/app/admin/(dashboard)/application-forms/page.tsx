import Link from "next/link";
import { FileStack, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { SERVICE_APPLICATION_CONFIGS, SERVICE_APPLICATION_TYPES } from "@/lib/applicationForms/config";

const APPLICATION_MODE_LABELS: Record<string, string> = {
  ONLINE_APPLICATION: "Online Application",
  ENQUIRY_ONLY: "Enquiry Only",
};

export default async function ApplicationFormsPage() {
  await requirePermission(PERMISSIONS.MANAGE_SERVICES);

  const cmsServices = await prisma.service.findMany({
    where: { slug: { in: SERVICE_APPLICATION_TYPES.map((t) => SERVICE_APPLICATION_CONFIGS[t].cmsSlug).filter((s): s is string => Boolean(s)) } },
  });
  const cmsBySlug = new Map(cmsServices.map((s) => [s.slug, s]));

  const docCounts = await prisma.serviceDocumentRequirement.groupBy({ by: ["serviceType"], _count: true });
  const docCountMap = Object.fromEntries(docCounts.map((c) => [c.serviceType, c._count]));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Application Forms</h1>
      <p className="mt-1 text-sm text-ink-500">
        Configure how many required or optional documents each service asks clients for.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SERVICE_APPLICATION_TYPES.map((type) => {
          const config = SERVICE_APPLICATION_CONFIGS[type];
          const cms = config.cmsSlug ? cmsBySlug.get(config.cmsSlug) : undefined;
          const docCount = docCountMap[type] ?? config.documents.length;
          const isConfigured = Boolean(docCountMap[type]);

          return (
            <Link
              key={type}
              href={`/admin/application-forms/${type}/documents`}
              className="flex items-center justify-between gap-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 hover:shadow-stub"
            >
              <div>
                <div className="flex items-center gap-2">
                  <FileStack size={16} className="text-forest-700" />
                  <span className="font-display text-base font-semibold text-forest-900">{cms?.title ?? config.title}</span>
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  {cms ? APPLICATION_MODE_LABELS[cms.applicationMode] : APPLICATION_MODE_LABELS.ONLINE_APPLICATION}
                  {" · "}
                  {docCount} document{docCount === 1 ? "" : "s"}
                  {!isConfigured && " (defaults)"}
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-ink-500" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
