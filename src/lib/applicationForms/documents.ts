import { prisma } from "@/lib/prisma";
import { SERVICE_APPLICATION_CONFIGS } from "./config";
import type { DocumentFieldConfig, ServiceApplicationType } from "./types";

export const MAX_UPLOAD_BYTES_DEFAULT = 8 * 1024 * 1024;

/**
 * Returns the documents a service currently asks for. A Super Admin's
 * configuration in ServiceDocumentRequirement always wins; if none has been
 * set up yet for a service, the built-in defaults from config.ts are used
 * so every service keeps working exactly as before out of the box.
 */
export async function getDocumentRequirements(serviceType: ServiceApplicationType): Promise<DocumentFieldConfig[]> {
  const rows = await prisma.serviceDocumentRequirement.findMany({
    where: { serviceType },
    orderBy: { order: "asc" },
  });

  if (rows.length === 0) {
    return SERVICE_APPLICATION_CONFIGS[serviceType].documents;
  }

  return rows.map((row) => ({
    id: row.docKey,
    label: row.name,
    required: row.isRequired,
    accept: row.fileTypes,
    helpText: row.description ?? undefined,
    maxSizeBytes: row.maxSizeMb * 1024 * 1024,
  }));
}
