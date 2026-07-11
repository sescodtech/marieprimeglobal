import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { STATUS_LABELS } from "@/lib/applicationForms/status";
import { MonthlyBarChart, CategoryBarChart, StatusPieChart } from "@/components/admin/analytics/AnalyticsCharts";

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

const ENQUIRY_SERVICE_LABELS: Record<string, string> = {
  FLIGHT_BOOKING: "Flight Booking",
  VISA_IMMIGRATION: "Visa & Immigration",
  TRAVEL_LOAN: "Travel Loan",
  STUDY_ABROAD: "Study Abroad",
  BUSINESS_REGISTRATION: "Business Registration",
  GENERAL_ENQUIRY: "General Enquiry",
};

function monthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export default async function AnalyticsPage() {
  await requirePermission(PERMISSIONS.VIEW_ANALYTICS);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [applicationsSince, byServiceType, byStatus, enquiriesByService, approvedCount, rejectedCount, completedCount, totalEnquiries, convertedEnquiries] =
    await Promise.all([
      prisma.serviceApplication.findMany({
        where: { submittedAt: { gte: sixMonthsAgo } },
        select: { submittedAt: true },
      }),
      prisma.serviceApplication.groupBy({ by: ["serviceType"], _count: true }),
      prisma.serviceApplication.groupBy({ by: ["status"], _count: true }),
      prisma.enquiry.groupBy({ by: ["serviceInterest"], _count: true }),
      prisma.serviceApplication.count({ where: { status: "APPROVED" } }),
      prisma.serviceApplication.count({ where: { status: "REJECTED" } }),
      prisma.serviceApplication.count({ where: { status: "COMPLETED" } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "CONVERTED" } }),
    ]);

  // Bucket applications by month (last 6 months) — done in JS rather than a
  // raw SQL date_trunc query, since 6 buckets is trivial to build client-side
  // and avoids a provider-specific query.
  const monthBuckets: { key: string; month: string; count: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(sixMonthsAgo);
    d.setMonth(d.getMonth() + i);
    monthBuckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: monthLabel(d), count: 0 });
  }
  for (const app of applicationsSince) {
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

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Analytics</h1>
      <p className="mt-1 text-sm text-ink-500">Applications, enquiries, and outcomes over time.</p>

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
        <ChartCard title="Applications by Month (last 6 months)">
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
