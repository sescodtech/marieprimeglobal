import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import type { EnquiryStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

const statusLabels: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

const statusStyles: Record<EnquiryStatus, string> = {
  NEW: "bg-gold-500/20 text-gold-600",
  CONTACTED: "bg-forest-700/10 text-forest-700",
  CONVERTED: "bg-blue-500/10 text-blue-600",
  CLOSED: "bg-ink-500/10 text-ink-500",
};

const serviceLabels: Record<string, string> = {
  FLIGHT_BOOKING: "Flight Booking",
  VISA_IMMIGRATION: "Visa & Immigration",
  TRAVEL_LOAN: "Travel Loan",
  STUDY_ABROAD: "Study Abroad",
  BUSINESS_REGISTRATION: "Business Registration",
  GENERAL_ENQUIRY: "General Enquiry",
};

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, PERMISSIONS.MANAGE_ENQUIRIES)) {
    redirect("/admin?error=unauthorized");
  }

  const { status, q } = await searchParams;

  const where: Prisma.EnquiryWhereInput = {};
  if (status && status !== "ALL") where.status = status as EnquiryStatus;
  if (q?.trim()) {
    const term = q.trim();
    where.OR = [
      { fullName: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
      { phone: { contains: term, mode: "insensitive" } },
      { subject: { contains: term, mode: "insensitive" } },
    ];
  }

  const enquiries = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { assignedStaff: { select: { name: true } } },
  });

  const counts = await prisma.enquiry.groupBy({ by: ["status"], _count: true });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  const tabs: { value: string; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "NEW", label: `New (${countMap.NEW || 0})` },
    { value: "CONTACTED", label: `Contacted (${countMap.CONTACTED || 0})` },
    { value: "CONVERTED", label: `Converted (${countMap.CONVERTED || 0})` },
    { value: "CLOSED", label: `Closed (${countMap.CLOSED || 0})` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Enquiries</h1>
      <p className="mt-1 text-sm text-ink-500">Every contact form submission lands here.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/enquiries?status=${tab.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                (status || "ALL") === tab.value
                  ? "bg-forest-700 text-cream-50"
                  : "bg-cream-50 text-ink-500 ring-1 ring-forest-900/10"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form method="GET" className="flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input type="text" name="q" defaultValue={q} placeholder="Search name, email, phone…" className="input" />
          <button type="submit" className="shrink-0 rounded-stub bg-forest-700 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-forest-900 text-cream-100">
            <tr>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Service</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Assigned</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-500">
                  No enquiries in this view yet.
                </td>
              </tr>
            )}
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-t border-forest-900/5">
                <td className="px-5 py-4">
                  <Link href={`/admin/enquiries/${enquiry.id}`} className="font-medium text-forest-900 hover:underline">
                    {enquiry.fullName}
                  </Link>
                  <div className="text-xs text-ink-500">{enquiry.email}</div>
                </td>
                <td className="px-5 py-4 text-ink-700">{serviceLabels[enquiry.serviceInterest]}</td>
                <td className="px-5 py-4 text-ink-500">{enquiry.assignedStaff?.name ?? "—"}</td>
                <td className="px-5 py-4 text-ink-500">{format(enquiry.createdAt, "MMM d, yyyy")}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${statusStyles[enquiry.status]}`}>
                    {statusLabels[enquiry.status]}
                  </span>
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
