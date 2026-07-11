import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type AuditActor = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type LogAuditParams = {
  actor: AuditActor | null;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
};

/**
 * Record one row in the audit trail. Call this from Server Actions after a
 * sensitive action succeeds (login/logout, user management, role changes —
 * and, in future phases, CMS publishes and application decisions).
 *
 * Deliberately swallows its own errors: a failure to *log* an action must
 * never roll back or break the action itself.
 */
export async function logAudit({ actor, action, entityType, entityId, description }: LogAuditParams) {
  try {
    const headerList = await headers();
    const ipAddress =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || null;
    const userAgent = headerList.get("user-agent") || null;

    await prisma.auditLog.create({
      data: {
        actorId: actor?.id ?? null,
        actorName: actor?.name ?? "Unknown",
        actorEmail: actor?.email ?? "unknown",
        actorRole: actor?.role ?? "UNKNOWN",
        action,
        entityType,
        entityId,
        description,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("[audit] Failed to record audit log entry (non-fatal):", error);
  }
}
