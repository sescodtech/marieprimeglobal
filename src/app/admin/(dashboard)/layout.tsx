import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectivePermissions } from "@/lib/permissionGrants";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { GlobalSearchBar } from "@/components/admin/GlobalSearchBar";
import { NotificationBell, type NotificationItem } from "@/components/admin/NotificationBell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  let notifications: NotificationItem[] = [];
  let unreadCount = 0;
  const permissions = session?.user?.id
    ? await getEffectivePermissions(session.user.id, session.user.role)
    : [];
  if (session?.user?.id) {
    const [unread, count] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientAdminId: session.user.id, isRead: false },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({ where: { recipientAdminId: session.user.id, isRead: false } }),
    ]);
    notifications = unread.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      link: n.link,
      createdAt: n.createdAt.toISOString(),
    }));
    unreadCount = count;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 font-body lg:flex-row">
      <AdminSidebar role={session?.user?.role} permissions={permissions} />
      {/* min-w-0 stops a wide child (e.g. a table) from stretching this flex
          item and forcing the whole page to scroll horizontally. */}
      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="hidden items-center justify-between gap-4 border-b border-forest-900/10 bg-cream-50 px-6 py-3 lg:flex">
          <GlobalSearchBar />
          <NotificationBell notifications={notifications} unreadCount={unreadCount} />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
