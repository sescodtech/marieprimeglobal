import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { STATUS_LABELS } from "@/lib/applicationForms/status";
import { MonthlyBarChart, CategoryBarChart, StatusPieChart } from "@/components/admin/analytics/AnalyticsCharts";
import { ENQUIRY_SERVICE_LABELS } from "@/lib/enquiryServiceLabels";

const SERVICE_TYPE_LABELS: Record<string, string> = {
  VISA: "Visa",
  PROOF_OF_FUNDS: "Proof of Funds",
  FLIGHT_BOOKING: "Flight Booking",
  HOTEL_RESERVATION: "Hotel Reservations",
  TRAVEL_INSURANCE: "Travel Insurance",
  LOGISTICS: "Logistics",
  PROCUREMENT: "Procurement",
  EVENT_COORDINATION: "Event Coordination",
  BEAUTY_SERVICES: "Beauty Services",
};

function monthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requirePermission(PERMISSIONS.VIEW_ANALYTICS);
  const { from: fromParam, to: toParam } = await searchParams;

  const defaultFrom = new Date();
  defaultFrom.setMonth(defaultFrom.getMonth() - 5);
  defaultFrom.setDate(1);
  defaultFrom.setHours(0, 0, 0, 0);

  const from = fromParam ? new Date(fromParam) : defaultFrom;
  const to = toParam ? new Date(toParam) : new Date();
  to.setHours(23, 59, 59, 999);

  const dateFilter = { submittedAt: { gte: from, lte: to } };
  const enquiryDateFilter = { createdAt: { gte: from, lte: to } };

  const [
    applicationsInRange,
    byServiceType,
    byStatus,
    enquiriesByService,
    approvedCount,
    rejectedCount,
    completedCount,
    totalEnquiries,
    convertedEnquiries,
    staff,
  ] = await Promise.all([
    prisma.serviceApplication.findMany({ where: dateFilter, select: { submittedAt: true } }),
    prisma.serviceApplication.groupBy({ by: ["serviceType"], where: dateFilter, _count: true }),
    prisma.serviceApplication.groupBy({ by: ["status"], where: dateFilter, _count: true }),
    prisma.enquiry.groupBy({ by: ["serviceInterest"], where: enquiryDateFilter, _count: true }),
    prisma.serviceApplication.count({ where: { ...dateFilter, status: "APPROVED" } }),
    prisma.serviceApplication.count({ where: { ...dateFilter, status: "REJECTED" } }),
    prisma.serviceApplication.count({ where: { ...dateFilter, status: "COMPLETED" } }),
    prisma.enquiry.count({ where: enquiryDateFilter }),
    prisma.enquiry.count({ where: { ...enquiryDateFilter, status: "CONVERTED" } }),
    prisma.admin.findMany({
      where: { role: { in: ["ADMIN", "STAFF", "SUPER_ADMIN"] }, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  // Bucket applications by month across the selected range — capped at 24
  // buckets so a very wide range still renders a readable chart.
  const monthBuckets: { key: string; month: string; count: number }[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  while (cursor <= to && monthBuckets.length < 24) {
    monthBuckets.push({ key: `${cursor.getFullYear()}-${cursor.getMonth()}`, month: monthLabel(cursor), count: 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  for (const app of applicationsInRange) {
    const key = `${app.submittedAt.getFullYear()}-${app.submittedAt.getMonth()}`;
    const bucket = monthBuckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
  }

  const monthlyGrowth =
    monthBuckets.length >= 2 && monthBuckets[monthBuckets.length - 2].count > 0
      ? Math.round(
          ((monthBuckets[monthBuckets.length - 1].count - monthBuckets[monthBuckets.length - 2].count) /
            monthBuckets[monthBuckets.length - 2].count) *
            1000
        ) / 10
      : null;

  const serviceTypeData = byServiceType
    .map((row) => ({ label: SERVICE_TYPE_LABELS[row.serviceType] ?? row.serviceType, count: row._count }))
    .sort((a, b) => b.count - a.count);

  const statusData = byStatus.map((row) => ({ label: STATUS_LABELS[row.status], count: row._count }));

  const enquiryServiceData = enquiriesByService
    .map((row) => ({ label: ENQUIRY_SERVICE_LABELS[row.serviceInterest] ?? row.serviceInterest, count: row._count }))
    .sort((a, b) => b.count - a.count);

  const decidedCount = approvedCount + rejectedCount;
  const approvalRate = decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 1000) / 10 : null;
  const conversionRate = totalEnquiries > 0 ? Math.round((convertedEnquiries / totalEnquiries) * 1000) / 10 : null;

  // Staff Workload + Processing Time — computed per active staff member,
  // scoped to the same date range via submittedAt.
  const workloadData: { label: string; count: number }[] = [];
  const processingTimeData: { label: string; count: number }[] = [];
  for (const s of staff) {
    const assignedCount = await prisma.serviceApplication.count({
      where: { assignedStaffId: s.id, ...dateFilter },
    });
    if (assignedCount > 0) workloadData.push({ label: s.name, count: assignedCount });

    const decided = await prisma.serviceApplication.findMany({
      where: { assignedStaffId: s.id, status: { in: ["APPROVED", "REJECTED", "COMPLETED"] }, ...dateFilter },
      select: { submittedAt: true, updatedAt: true },
    });
    if (decided.length > 0) {
      const avgDays =
        decided.reduce((sum, a) => sum + (a.updatedAt.getTime() - a.submittedAt.getTime()), 0) /
        decided.length /
        (1000 * 60 * 60 * 24);
      processingTimeData.push({ label: s.name, count: Math.round(avgDays * 10) / 10 });
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Analytics</h1>
          <p className="mt-1 text-sm text-ink-500">Applications, enquiries, and outcomes over time.</p>
        </div>
        <form method="GET" className="flex items-end gap-3">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">From</span>
            <input type="date" name="from" defaultValue={isoDate(from)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">To</span>
            <input type="date" name="to" defaultValue={isoDate(to)} className="input" />
          </label>
          <button type="submit" className="rounded-stub bg-forest-700 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
            Apply
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Approval Rate" value={approvalRate !== null ? `${approvalRate}%` : "—"} />
        <StatCard label="Conversion Rate" value={conversionRate !== null ? `${conversionRate}%` : "—"} />
        <StatCard label="Completed Applications" value={completedCount} />
        <StatCard
          label="Monthly Growth"
          value={monthlyGrowth !== null ? `${monthlyGrowth > 0 ? "+" : ""}${monthlyGrowth}%` : "—"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Applications by Month">
          <MonthlyBarChart data={monthBuckets.map((b) => ({ month: b.month, count: b.count }))} />
        </ChartCard>
        <ChartCard title="Status Distribution">
          <StatusPieChart data={statusData} />
        </ChartCard>
        <ChartCard title="Applications by Service">
          <CategoryBarChart data={serviceTypeData} />
        </ChartCard>
        <ChartCard title="Enquiries by Service">
          <CategoryBarChart data={enquiryServiceData} />
        </ChartCard>
        <ChartCard title="Staff Workload (assigned applications)">
          {workloadData.length > 0 ? (
            <CategoryBarChart data={workloadData} />
          ) : (
            <p className="py-10 text-center text-sm text-ink-500">No assignments in this range.</p>
          )}
        </ChartCard>
        <ChartCard title="Processing Time (avg. days, decided applications)">
          {processingTimeData.length > 0 ? (
            <CategoryBarChart data={processingTimeData} />
          ) : (
            <p className="py-10 text-center text-sm text-ink-500">No decided applications in this range.</p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
      <div className="font-display text-3xl font-semibold text-forest-900">{value}</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
      <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
