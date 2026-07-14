import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasGrantedPermission, PERMISSIONS } from "@/lib/permissions";
import { getEffectivePermissions } from "@/lib/permissionGrants";
import { STATUS_LABELS, statusBadgeClass, type ServiceApplicationStatus } from "@/lib/applicationForms/status";

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "SUBMITTED", label: "Pending" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "PROCESSING", label: "Processing" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "COMPLETED", label: "Completed" },
];

const RANGE_OPTIONS = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
];

function rangeStartDate(range?: string): Date | null {
  const now = new Date();
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  }
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return null;
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; range?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = session.user.role;
  const permissions = await getEffectivePermissions(session.user.id, role);
  const canViewAll = hasGrantedPermission(permissions, PERMISSIONS.VIEW_APPLICATIONS);
  const canViewAssignedOnly = hasGrantedPermission(permissions, PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS);
  if (!canViewAll && !canViewAssignedOnly) redirect("/admin?error=unauthorized");

  const { status, q, range } = await searchParams;

  const where: Prisma.ServiceApplicationWhereInput = {};
  if (!canViewAll) {
    where.assignedStaffId = session.user.id;
  }
  if (status && status !== "all") {
    where.status = status as ServiceApplicationStatus;
  }
  const startDate = rangeStartDate(range);
  if (startDate) {
    where.submittedAt = { gte: startDate };
  }
  if (q?.trim()) {
    const term = q.trim();
    where.OR = [
      { referenceNumber: { contains: term, mode: "insensitive" } },
      { applicantName: { contains: term, mode: "insensitive" } },
      { applicantEmail: { contains: term, mode: "insensitive" } },
      { applicantPhone: { contains: term, mode: "insensitive" } },
      { serviceTitle: { contains: term, mode: "insensitive" } },
    ];
  }

  const applications = await prisma.serviceApplication.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    take: 100,
    include: { assignedStaff: { select: { name: true } } },
  });

  const activeTab = status && TABS.some((t) => t.key === status) ? status : "all";
  const activeRange = range && RANGE_OPTIONS.some((r) => r.key === range) ? range : "all";

  function buildHref(overrides: { status?: string; range?: string; q?: string }) {
    const params = new URLSearchParams();
    const nextStatus = overrides.status ?? activeTab;
    const nextRange = overrides.range ?? activeRange;
    const nextQ = overrides.q ?? q ?? "";
    if (nextStatus !== "all") params.set("status", nextStatus);
    if (nextRange !== "all") params.set("range", nextRange);
    if (nextQ) params.set("q", nextQ);
    const qs = params.toString();
    return qs ? `/admin/applications?${qs}` : "/admin/applications";
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Applications</h1>
      <p className="mt-1 text-sm text-ink-500">
        {canViewAll ? "All client applications." : "Applications assigned to you."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={buildHref({ status: tab.key })}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              activeTab === tab.key ? "bg-forest-700 text-cream-50" : "bg-forest-700/10 text-forest-700 hover:bg-forest-700/20"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form method="GET" className="flex w-full max-w-sm items-center gap-2">
          {activeTab !== "all" && <input type="hidden" name="status" value={activeTab} />}
          {activeRange !== "all" && <input type="hidden" name="range" value={activeRange} />}
          <input type="text" name="q" defaultValue={q} placeholder="Search reference, name, email, phone…" className="input" />
          <button type="submit" className="shrink-0 rounded-stub bg-forest-700 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
            Search
          </button>
        </form>

        <div className="flex gap-2">
          {RANGE_OPTIONS.map((option) => (
            <Link
              key={option.key}
              href={buildHref({ range: option.key })}
              className={`rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                activeRange === option.key ? "bg-gold-500/20 text-gold-700" : "bg-ink-500/5 text-ink-500 hover:bg-ink-500/10"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wider text-ink-500">
              <th className="px-4 py-3 font-mono">Reference</th>
              <th className="px-4 py-3 font-mono">Applicant</th>
              <th className="px-4 py-3 font-mono">Service</th>
              <th className="px-4 py-3 font-mono">Status</th>
              <th className="px-4 py-3 font-mono">Assigned</th>
              <th className="px-4 py-3 font-mono">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/5">
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                  No applications found.
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-forest-700/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/applications/${app.id}`} className="font-mono text-xs font-semibold text-forest-700 hover:underline">
                    {app.referenceNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-forest-900">{app.applicantName}</div>
                  <div className="text-xs text-ink-500">{app.applicantEmail}</div>
                </td>
                <td className="px-4 py-3 text-ink-700">{app.serviceTitle}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${statusBadgeClass(app.status)}`}>
                    {STATUS_LABELS[app.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-500">{app.assignedStaff?.name ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                  {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(app.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
