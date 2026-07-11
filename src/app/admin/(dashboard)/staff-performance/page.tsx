import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

type Row = {
  id: string;
  name: string;
  role: string;
  assigned: number;
  completed: number;
  pending: number;
  approved: number;
  rejected: number;
  avgProcessingDays: number | null;
};

async function computeRow(id: string, name: string, role: string): Promise<Row> {
  const [assigned, completed, pending, approved, rejected, completedApps] = await Promise.all([
    prisma.serviceApplication.count({ where: { assignedStaffId: id } }),
    prisma.serviceApplication.count({ where: { assignedStaffId: id, status: "COMPLETED" } }),
    prisma.serviceApplication.count({
      where: { assignedStaffId: id, status: { notIn: ["APPROVED", "REJECTED", "COMPLETED"] } },
    }),
    prisma.serviceApplication.count({ where: { assignedStaffId: id, status: "APPROVED" } }),
    prisma.serviceApplication.count({ where: { assignedStaffId: id, status: "REJECTED" } }),
    prisma.serviceApplication.findMany({
      where: { assignedStaffId: id, status: { in: ["APPROVED", "REJECTED", "COMPLETED"] } },
      select: { submittedAt: true, updatedAt: true },
    }),
  ]);

  let avgProcessingDays: number | null = null;
  if (completedApps.length > 0) {
    const totalMs = completedApps.reduce(
      (sum, app) => sum + (app.updatedAt.getTime() - app.submittedAt.getTime()),
      0
    );
    avgProcessingDays = Math.round((totalMs / completedApps.length / (1000 * 60 * 60 * 24)) * 10) / 10;
  }

  return { id, name, role, assigned, completed, pending, approved, rejected, avgProcessingDays };
}

export default async function StaffPerformancePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const role = session.user.role;

  const canViewAll = hasPermission(role, PERMISSIONS.VIEW_APPLICATIONS);
  const canViewOwn = hasPermission(role, PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS);
  if (!canViewAll && !canViewOwn) redirect("/admin?error=unauthorized");

  let rows: Row[];
  if (canViewAll) {
    const staff = await prisma.admin.findMany({
      where: { role: { in: ["ADMIN", "STAFF", "SUPER_ADMIN"] }, status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
    rows = await Promise.all(staff.map((s) => computeRow(s.id, s.name, s.role)));
  } else {
    rows = [await computeRow(session.user.id, session.user.name ?? "You", role)];
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Staff Performance</h1>
      <p className="mt-1 text-sm text-ink-500">
        {canViewAll ? "Workload and outcomes across every Admin and Staff account." : "Your workload and outcomes."}
      </p>

      <div className="mt-8 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-forest-900 text-cream-100">
              <tr>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Assigned</th>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Pending</th>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Completed</th>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Approved</th>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Rejected</th>
                <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Avg. Processing</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-forest-900/5">
                  <td className="px-5 py-4 font-medium text-forest-900">{row.name}</td>
                  <td className="px-5 py-4 text-ink-700">{row.assigned}</td>
                  <td className="px-5 py-4 text-ink-700">{row.pending}</td>
                  <td className="px-5 py-4 text-ink-700">{row.completed}</td>
                  <td className="px-5 py-4 text-forest-700">{row.approved}</td>
                  <td className="px-5 py-4 text-red-600">{row.rejected}</td>
                  <td className="px-5 py-4 text-ink-500">
                    {row.avgProcessingDays !== null ? `${row.avgProcessingDays}d` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
