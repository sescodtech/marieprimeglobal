import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

type ResultGroup = { label: string; items: { title: string; subtitle?: string; href: string }[] };

export default async function GlobalSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const role = session.user.role;

  const { q } = await searchParams;
  const term = q?.trim() ?? "";
  const groups: ResultGroup[] = [];

  if (term.length >= 2) {
    const ci = { contains: term, mode: "insensitive" as const };

    if (hasPermission(role, PERMISSIONS.VIEW_APPLICATIONS) || hasPermission(role, PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS)) {
      const apps = await prisma.serviceApplication.findMany({
        where: {
          OR: [{ referenceNumber: ci }, { applicantName: ci }, { applicantEmail: ci }, { applicantPhone: ci }],
          ...(hasPermission(role, PERMISSIONS.VIEW_APPLICATIONS) ? {} : { assignedStaffId: session.user.id }),
        },
        take: 8,
      });
      if (apps.length > 0) {
        groups.push({
          label: "Applications",
          items: apps.map((a) => ({
            title: `${a.referenceNumber} — ${a.applicantName}`,
            subtitle: a.serviceTitle,
            href: `/admin/applications/${a.id}`,
          })),
        });
      }
    }

    if (hasPermission(role, PERMISSIONS.MANAGE_ENQUIRIES)) {
      const enquiries = await prisma.enquiry.findMany({
        where: { OR: [{ fullName: ci }, { email: ci }, { phone: ci }, { subject: ci }] },
        take: 8,
      });
      if (enquiries.length > 0) {
        groups.push({
          label: "Enquiries",
          items: enquiries.map((e) => ({ title: e.fullName, subtitle: e.email, href: `/admin/enquiries/${e.id}` })),
        });
      }
    }

    if (hasPermission(role, PERMISSIONS.MANAGE_SERVICES)) {
      const services = await prisma.service.findMany({ where: { title: ci }, take: 8 });
      if (services.length > 0) {
        groups.push({
          label: "Services",
          items: services.map((s) => ({ title: s.title, subtitle: s.slug, href: `/admin/services/${s.id}` })),
        });
      }
    }

    if (hasPermission(role, PERMISSIONS.MANAGE_STAFF)) {
      const staff = await prisma.admin.findMany({ where: { OR: [{ name: ci }, { email: ci }] }, take: 8 });
      if (staff.length > 0) {
        groups.push({
          label: "Staff & Admins",
          items: staff.map((s) => ({ title: s.name, subtitle: s.email, href: `/admin/users/${s.id}` })),
        });
      }
    }

    if (hasPermission(role, PERMISSIONS.MANAGE_BLOG)) {
      const posts = await prisma.blogPost.findMany({ where: { title: ci }, take: 8 });
      if (posts.length > 0) {
        groups.push({
          label: "Blog",
          items: posts.map((p) => ({ title: p.title, subtitle: p.category, href: `/admin/blog/${p.id}` })),
        });
      }
    }

    if (hasPermission(role, PERMISSIONS.MANAGE_TESTIMONIALS)) {
      const testimonials = await prisma.testimonial.findMany({ where: { clientName: ci }, take: 8 });
      if (testimonials.length > 0) {
        groups.push({
          label: "Testimonials",
          items: testimonials.map((t) => ({ title: t.clientName, subtitle: t.clientRole ?? "", href: `/admin/testimonials/${t.id}` })),
        });
      }
    }

    if (hasPermission(role, PERMISSIONS.MANAGE_FAQS)) {
      const faqs = await prisma.faq.findMany({ where: { question: ci }, take: 8 });
      if (faqs.length > 0) {
        groups.push({
          label: "FAQs",
          items: faqs.map((f) => ({ title: f.question, subtitle: f.category, href: `/admin/faq/${f.id}` })),
        });
      }
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Search</h1>
      <form method="GET" className="mt-4 flex max-w-xl items-center gap-2">
        <input type="text" name="q" defaultValue={q} placeholder="Search everything…" className="input" autoFocus />
        <button type="submit" className="shrink-0 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
          Search
        </button>
      </form>

      {term.length >= 2 && groups.length === 0 && (
        <p className="mt-8 text-sm text-ink-500">No results for &ldquo;{term}&rdquo;.</p>
      )}

      <div className="mt-8 space-y-6">
        {groups.map((group) => (
          <div key={group.label} className="rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">{group.label}</h2>
            <ul className="mt-3 divide-y divide-forest-900/5">
              {group.items.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:bg-forest-700/5">
                    <span className="font-medium text-forest-900">{item.title}</span>
                    {item.subtitle && <span className="shrink-0 text-xs text-ink-500">{item.subtitle}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
