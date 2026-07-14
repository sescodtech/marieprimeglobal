import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { SERVICE_APPLICATION_CONFIGS } from "@/lib/applicationForms/config";
import type { ServiceApplicationType } from "@/lib/applicationForms/types";
import {
  createDocumentRequirement,
  updateDocumentRequirement,
  deleteDocumentRequirement,
  seedDefaultDocumentRequirements,
} from "@/lib/actions/documentRequirements";
import { DocumentRequirementsManager } from "@/components/admin/DocumentRequirementsManager";

export default async function ServiceDocumentsPage({ params }: { params: Promise<{ type: string }> }) {
  await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const { type } = await params;

  const config = SERVICE_APPLICATION_CONFIGS[type as ServiceApplicationType];
  if (!config) notFound();

  const rows = await prisma.serviceDocumentRequirement.findMany({
    where: { serviceType: type as ServiceApplicationType },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <Link href="/admin/application-forms" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to Application Forms
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">{config.title} — Documents</h1>
      <p className="mt-1 text-sm text-ink-500">
        Configure the documents clients must (or may optionally) upload when applying for this service.
      </p>

      <div className="mt-8 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
        <DocumentRequirementsManager
          rows={rows}
          isConfigured={rows.length > 0}
          createAction={createDocumentRequirement.bind(null, type)}
          updateAction={updateDocumentRequirement}
          deleteAction={deleteDocumentRequirement}
          seedAction={seedDefaultDocumentRequirements.bind(null, type)}
        />
      </div>
    </div>
  );
}
