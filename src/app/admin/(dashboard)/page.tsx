import Link from "next/link";
import {
  Briefcase,
  Quote,
  Inbox,
  Image as ImageIcon,
  ArrowRight,
  ClipboardList,
  Clock,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Users,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export default async function AdminOverviewPage() {
  const session = await auth();
  const role = session?.user?.role;
  const canViewApplications = hasPermission(role, PERMISSIONS.VIEW_APPLICATIONS);
  const canViewAssignedOnly = hasPermission(role, PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS);
  const canManageEnquiries = hasPermission(role, PERMISSIONS.MANAGE_ENQUIRIES);
  const canManageServices = hasPermission(role, PERMISSIONS.MANAGE_SERVICES);
  const canManageStaff = hasPermission(role, PERMISSIONS.MANAGE_STAFF);

  // ---- Executive KPI cards (Admin / Super Admin) ----
  if (canViewApplications) {
    const [
      totalApplications,
      pending,
      underReview,
      processing,
      approved,
      rejected,
      completed,
      totalEnquiries,
      totalServices,
      activeStaff,
      activeAdmins,
      recentApplications,
    ] = await Promise.all([
      prisma.serviceApplication.count(),
      prisma.serviceApplication.count({ where: { status: "SUBMITTED" } }),
      prisma.serviceApplication.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.serviceApplication.count({ where: { status: "PROCESSING" } }),
      prisma.serviceApplication.count({ where: { status: "APPROVED" } }),
      prisma.serviceApplication.count({ where: { status: "REJECTED" } }),
      prisma.serviceApplication.count({ where: { status: "COMPLETED" } }),
      prisma.enquiry.count(),
      prisma.service.count({ where: { isArchived: false } }),
      prisma.admin.count({ where: { role: "STAFF", status: "ACTIVE" } }),
      prisma.admin.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] }, status: "ACTIVE" } }),
      prisma.serviceApplication.findMany({ take: 6, orderBy: { submittedAt: "desc" } }),
    ]);

    const kpis = [
      { label: "Total Applications", value: totalApplications, icon: ClipboardList, href: "/admin/applications" },
      { label: "Pending", value: pending, icon: Clock, href: "/admin/applications?status=SUBMITTED" },
      { label: "Under Review", value: underReview, icon: Eye, href: "/admin/applications?status=UNDER_REVIEW" },
      { label: "Processing", value: processing, icon: Loader2, href: "/admin/applications?status=PROCESSING" },
      { label: "Approved", value: approved, icon: CheckCircle2, href: "/admin/applications?status=APPROVED" },
      { label: "Rejected", value: rejected, icon: XCircle, href: "/admin/applications?status=REJECTED" },
      { label: "Completed", value: completed, icon: BadgeCheck, href: "/admin/applications?status=COMPLETED" },
      ...(canManageEnquiries ? [{ label: "Total Enquiries", value: totalEnquiries, icon: Inbox, href: "/admin/enquiries" }] : []),
      ...(canManageServices ? [{ label: "Total Services", value: totalServices, icon: Briefcase, href: "/admin/services" }] : []),
      ...(canManageStaff
        ? [
            { label: "Active Staff", value: activeStaff, icon: Users, href: "/admin/users" },
            { label: "Active Admins", value: activeAdmins, icon: ShieldCheck, href: "/admin/users" },
          ]
        : []),
    ];

    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-900">Executive Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">A live snapshot across applications, enquiries, and the team.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={kpi.label}
                href={kpi.href}
                className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 transition-shadow hover:shadow-stub"
              >
                <Icon size={20} className="text-forest-700" />
                <div className="mt-4 font-display text-3xl font-semibold text-forest-900">{kpi.value}</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-500">{kpi.label}</div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-forest-900">Recent applications</h2>
            <Link href="/admin/applications" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-forest-700">
              View all
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-forest-900/5">
            {recentApplications.length === 0 && (
              <p className="py-6 text-center text-sm text-ink-500">No applications yet.</p>
            )}
            {recentApplications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-forest-700/5"
              >
                <span className="truncate font-medium text-forest-900">
                  {app.applicantName} <span className="text-ink-500">· {app.serviceTitle}</span>
                </span>
                <span className="shrink-0 text-xs text-ink-500">{app.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Staff: personal queue snapshot ----
  if (canViewAssignedOnly && session?.user?.id) {
    const [assigned, pendingMine, completedMine, recentAssigned] = await Promise.all([
      prisma.serviceApplication.count({ where: { assignedStaffId: session.user.id } }),
      prisma.serviceApplication.count({
        where: { assignedStaffId: session.user.id, status: { notIn: ["APPROVED", "REJECTED", "COMPLETED"] } },
      }),
      prisma.serviceApplication.count({ where: { assignedStaffId: session.user.id, status: "COMPLETED" } }),
      prisma.serviceApplication.findMany({
        where: { assignedStaffId: session.user.id },
        take: 6,
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const stats = [
      { label: "Assigned to me", value: assigned, icon: ClipboardList },
      { label: "In progress", value: pendingMine, icon: Clock },
      { label: "Completed", value: completedMine, icon: CheckCircle2 },
    ];

    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-900">My Queue</h1>
        <p className="mt-1 text-sm text-ink-500">Applications assigned to you.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href="/admin/applications"
                className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 transition-shadow hover:shadow-stub"
              >
                <Icon size={20} className="text-forest-700" />
                <div className="mt-4 font-display text-3xl font-semibold text-forest-900">{stat.value}</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-500">{stat.label}</div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Recently updated</h2>
          <div className="mt-4 divide-y divide-forest-900/5">
            {recentAssigned.length === 0 && (
              <p className="py-6 text-center text-sm text-ink-500">Nothing assigned to you yet.</p>
            )}
            {recentAssigned.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-forest-700/5"
              >
                <span className="truncate font-medium text-forest-900">
                  {app.applicantName} <span className="text-ink-500">· {app.serviceTitle}</span>
                </span>
                <span className="shrink-0 text-xs text-ink-500">{app.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Fallback (shouldn't normally happen for a logged-in admin) ----
  const [serviceCount, testimonialCount, mediaCount] = await Promise.all([
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.mediaAsset.count(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Services", value: serviceCount, icon: Briefcase, href: "/admin/services" },
          { label: "Testimonials", value: testimonialCount, icon: Quote, href: "/admin/testimonials" },
          { label: "Media assets", value: mediaCount, icon: ImageIcon, href: "/admin/media" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 transition-shadow hover:shadow-stub"
            >
              <Icon size={20} className="text-forest-700" />
              <div className="mt-4 font-display text-3xl font-semibold text-forest-900">{stat.value}</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-500">{stat.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
