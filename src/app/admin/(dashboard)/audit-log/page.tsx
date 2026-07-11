import { format } from "date-fns";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AuditLogPage() {
  await requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS);
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Audit Log</h1>
      <p className="mt-1 text-sm text-ink-500">The most recent 200 actions taken across the admin dashboard.</p>

      <div className="mt-8 overflow-x-auto rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wider text-ink-500">
              <th className="px-4 py-3 font-mono">Time</th>
              <th className="px-4 py-3 font-mono">Actor</th>
              <th className="px-4 py-3 font-mono">Action</th>
              <th className="px-4 py-3 font-mono">Details</th>
              <th className="px-4 py-3 font-mono">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/5">
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-500">
                  No activity recorded yet.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                  {format(log.createdAt, "MMM d, yyyy h:mm a")}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-forest-900">{log.actorName}</div>
                  <div className="text-xs text-ink-500">{log.actorEmail}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-forest-700">
                  {log.action}
                </td>
                <td className="px-4 py-3 text-ink-700">{log.description}</td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-500">{log.ipAddress ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
