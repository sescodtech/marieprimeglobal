import { prisma } from "@/lib/prisma";
import { getServiceApplicationConfig } from "./config";
import type { DocumentFieldConfig } from "./types";
import type { ServiceApplicationType as PrismaServiceApplicationType } from "@prisma/client";

export const MAX_UPLOAD_BYTES_DEFAULT = 8 * 1024 * 1024;

/**
 * Returns the documents a service currently asks for. A Super Admin's
 * configuration in ServiceDocumentRequirement always wins; if none has been
 * set up yet for a service, the built-in defaults from config.ts are used
 * so every service keeps working exactly as before out of the box.
 *
 * Takes the full Prisma-generated enum (not the narrower app-level
 * ServiceApplicationType from ./types) because this is always called with a
 * value read straight off a DB row, which can in principle still be one of
 * the deprecated LOGISTICS/PROCUREMENT/EVENT_COORDINATION/BEAUTY_SERVICES
 * values kept in the Postgres enum for migration safety. Those have no
 * config entry, so they fall back to an empty document list rather than
 * throwing — nothing writes those values anymore, so this path is dead code
 * in practice, just a safe guard against a stale historical row.
 */
export async function getDocumentRequirements(
  serviceType: PrismaServiceApplicationType
): Promise<DocumentFieldConfig[]> {
  const rows = await prisma.serviceDocumentRequirement.findMany({
    where: { serviceType },
    orderBy: { order: "asc" },
  });

  if (rows.length === 0) {
    return getServiceApplicationConfig(serviceType)?.documents ?? [];
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
