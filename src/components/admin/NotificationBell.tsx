"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  createdAt: string;
};

export function NotificationBell({ notifications, unreadCount }: { notifications: NotificationItem[]; unreadCount: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-ink-500 hover:bg-forest-700/10 hover:text-forest-700"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/10">
            <div className="flex items-center justify-between border-b border-forest-900/10 px-4 py-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-500">
                Notifications
              </span>
              {notifications.length > 0 && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => markAllNotificationsRead())}
                  className="text-xs font-medium text-forest-700 hover:underline disabled:opacity-60"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-ink-500">You're all caught up.</p>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link ?? "/admin"}
                    onClick={() => startTransition(() => markNotificationRead(n.id))}
                    className="block border-b border-forest-900/5 px-4 py-3 hover:bg-forest-700/5"
                  >
                    <p className="text-sm font-medium text-forest-900">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{n.body}</p>
                    <p className="mt-1 text-[11px] text-ink-500">
                      {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(n.createdAt))}
                    </p>
                  </Link>
                ))
              )}
            </div>
            <div className="border-t border-forest-900/10 px-4 py-2.5 text-center">
              <Link href="/admin/notifications" className="text-xs font-semibold text-forest-700 hover:underline">
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
