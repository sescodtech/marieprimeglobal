import Link from "next/link";
import { Briefcase, Quote, Inbox, Image as ImageIcon, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [serviceCount, testimonialCount, enquiryCount, newEnquiryCount, mediaCount, recentEnquiries] =
    await Promise.all([
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.mediaAsset.count(),
      prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);

  const stats = [
    { label: "Services", value: serviceCount, icon: Briefcase, href: "/admin/services" },
    { label: "Testimonials", value: testimonialCount, icon: Quote, href: "/admin/testimonials" },
    { label: "Enquiries", value: enquiryCount, icon: Inbox, href: "/admin/enquiries" },
    { label: "Media assets", value: mediaCount, icon: ImageIcon, href: "/admin/media" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Overview</h1>
      <p className="mt-1 text-sm text-ink-500">
        {newEnquiryCount > 0
          ? `${newEnquiryCount} new ${newEnquiryCount === 1 ? "enquiry" : "enquiries"} waiting for a response.`
          : "No new enquiries right now."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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

      <div className="mt-10 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-forest-900">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-forest-700">
            View all
            <ArrowRight size={13} />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-forest-900/5">
          {recentEnquiries.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-500">No enquiries yet.</p>
          )}
          {recentEnquiries.map((enquiry) => (
            <Link
              key={enquiry.id}
              href={`/admin/enquiries/${enquiry.id}`}
              className="flex items-center justify-between py-3 text-sm hover:bg-forest-700/5"
            >
              <span className="font-medium text-forest-900">{enquiry.fullName}</span>
              <span className="text-xs text-ink-500">{enquiry.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
