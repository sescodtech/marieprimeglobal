import Link from "next/link";
import { format } from "date-fns";
import { requireAdmin } from "@/lib/actions/require-admin";
import { prisma } from "@/lib/prisma";
import { markNotificationRead, markAllNotificationsRead, deleteNotification, deleteAllReadNotifications } from "@/lib/actions/notifications";

const CATEGORY_LABELS: Record<string, string> = {
  APPLICATIONS: "Applications",
  ENQUIRIES: "Enquiries",
  DOCUMENTS: "Documents",
  NEWSLETTER: "Newsletter",
  USERS: "Users",
  MEDIA: "Media",
  SETTINGS: "Settings",
  SECURITY: "Security",
  AUDIT_LOGS: "Audit Logs",
  SYSTEM: "System",
};

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const actor = await requireAdmin();
  const { q, category, status } = await searchParams;

  const notifications = await prisma.notification.findMany({
    where: {
      recipientAdminId: actor.id,
      ...(category && category !== "ALL" ? { category } : {}),
      ...(status === "UNREAD" ? { isRead: false } : status === "READ" ? { isRead: true } : {}),
      ...(q?.trim()
        ? { OR: [{ title: { contains: q.trim(), mode: "insensitive" } }, { body: { contains: q.trim(), mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Notifications</h1>
          <p className="mt-1 text-sm text-ink-500">Everything relevant to your account and permissions.</p>
        </div>
        <div className="flex items-center gap-4">
          <form action={markAllNotificationsRead}>
            <button type="submit" className="text-sm font-medium text-forest-700 hover:underline">
              Mark all read
            </button>
          </form>
          <form action={deleteAllReadNotifications}>
            <button type="submit" className="text-sm font-medium text-red-500 hover:underline">
              Delete read
            </button>
          </form>
        </div>
      </div>

      <form method="GET" className="mt-6 flex flex-wrap items-center gap-2">
        <input type="text" name="q" defaultValue={q} placeholder="Search notifications…" className="input max-w-xs" />
        <select name="category" defaultValue={category || "ALL"} className="input max-w-[180px]">
          <option value="ALL">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select name="status" defaultValue={status || "ALL"} className="input max-w-[140px]">
          <option value="ALL">All</option>
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
        </select>
        <button type="submit" className="rounded-stub bg-forest-700 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
          Filter
        </button>
      </form>

      <div className="mt-6 divide-y divide-forest-900/5 rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        {notifications.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-500">No notifications found.</p>}
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-start justify-between gap-4 px-5 py-4 ${!n.isRead ? "bg-forest-700/5" : ""}`}>
            <Link
              href={n.link ?? "/admin"}
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-forest-700/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-forest-700">
                  {CATEGORY_LABELS[n.category] ?? n.category}
                </span>
                {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
              </div>
              <p className="mt-1 text-sm font-medium text-forest-900">{n.title}</p>
              <p className="text-sm text-ink-500">{n.body}</p>
              <p className="mt-1 text-xs text-ink-500">{format(n.createdAt, "MMM d, yyyy 'at' h:mm a")}</p>
            </Link>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {!n.isRead && (
                <form action={markNotificationRead.bind(null, n.id)}>
                  <button type="submit" className="text-xs font-medium text-forest-700 hover:underline">
                    Mark read
                  </button>
                </form>
              )}
              <form action={deleteNotification.bind(null, n.id)}>
                <button type="submit" className="text-xs font-medium text-red-500 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
