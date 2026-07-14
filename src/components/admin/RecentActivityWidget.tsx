import Link from "next/link";
import { ClipboardList, Inbox, ScrollText, LogIn, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function RecentActivityWidget() {
  const [applications, enquiries, staffActivity, logins, newsletters] = await Promise.all([
    prisma.serviceApplication.findMany({ take: 5, orderBy: { submittedAt: "desc" } }),
    prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.auditLog.findMany({
      where: { action: { notIn: ["LOGIN", "LOGOUT"] } },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({ where: { action: "LOGIN" }, take: 5, orderBy: { createdAt: "desc" } }),
    prisma.newsletter.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const panels = [
    {
      label: "Recent Applications",
      icon: ClipboardList,
      items: applications.map((a) => ({
        text: `${a.applicantName} — ${a.serviceTitle}`,
        meta: a.status,
        time: a.submittedAt,
        href: `/admin/applications/${a.id}`,
      })),
      emptyText: "No applications yet.",
    },
    {
      label: "Recent Enquiries",
      icon: Inbox,
      items: enquiries.map((e) => ({
        text: e.fullName,
        meta: e.status,
        time: e.createdAt,
        href: `/admin/enquiries/${e.id}`,
      })),
      emptyText: "No enquiries yet.",
    },
    {
      label: "Recent Staff Activity",
      icon: ScrollText,
      items: staffActivity.map((a) => ({
        text: a.description ?? a.action,
        meta: a.actorName,
        time: a.createdAt,
        href: "/admin/audit-log",
      })),
      emptyText: "No activity recorded yet.",
    },
    {
      label: "Recent Login History",
      icon: LogIn,
      items: logins.map((a) => ({
        text: a.actorName,
        meta: a.ipAddress ?? "",
        time: a.createdAt,
        href: "/admin/audit-log",
      })),
      emptyText: "No logins recorded yet.",
    },
    {
      label: "Recent Newsletter Activity",
      icon: Mail,
      items: newsletters.map((n) => ({
        text: n.subject,
        meta: n.status,
        time: n.sentAt ?? n.createdAt,
        href: "/admin/newsletter",
      })),
      emptyText: "No newsletters sent yet.",
    },
  ];

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      {panels.map((panel) => {
        const Icon = panel.icon;
        return (
          <div key={panel.label} className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-forest-700" />
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">{panel.label}</h2>
            </div>
            <div className="mt-3 divide-y divide-forest-900/5">
              {panel.items.length === 0 && <p className="py-4 text-center text-sm text-ink-500">{panel.emptyText}</p>}
              {panel.items.map((item, i) => (
                <Link key={i} href={item.href} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:bg-forest-700/5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-forest-900">{item.text}</p>
                    {item.meta && <p className="truncate text-xs text-ink-500">{item.meta}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-ink-500">{timeAgo(item.time)}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
