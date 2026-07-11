"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Quote,
  UserCircle,
  Image as ImageIcon,
  Inbox,
  Search,
  Settings,
  KeyRound,
  Newspaper,
  UsersRound,
  Users,
  ScrollText,
  ClipboardList,
  HelpCircle,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { SignOutButton } from "@/components/admin/SignOutButton";

const contentNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/careers", label: "Careers", icon: UsersRound },
  { href: "/admin/faq", label: "FAQs", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/director", label: "Director Profile", icon: UserCircle },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

const accountNavItem = { href: "/admin/account", label: "Account", icon: KeyRound };

export function AdminSidebar({ role }: { role?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    ...contentNavItems,
    ...(hasPermission(role, PERMISSIONS.VIEW_APPLICATIONS) || hasPermission(role, PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS)
      ? [{ href: "/admin/applications", label: "Applications", icon: ClipboardList }]
      : []),
    ...(hasPermission(role, PERMISSIONS.MANAGE_STAFF)
      ? [{ href: "/admin/users", label: "Users", icon: Users }]
      : []),
    ...(hasPermission(role, PERMISSIONS.VIEW_AUDIT_LOGS)
      ? [{ href: "/admin/audit-log", label: "Audit Log", icon: ScrollText }]
      : []),
    accountNavItem,
  ];

  // Close the drawer whenever the route changes (menu item selected).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const currentItem = navItems.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );

  return (
    <>
      {/* Sticky mobile top bar — always visible so the hamburger is never lost while scrolling. */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-cream-50/10 bg-forest-900 px-4 py-3.5 text-cream-100 lg:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <MarkIcon />
          <span className="truncate font-display text-sm font-semibold text-cream-50">
            {currentItem?.label ?? "MariePrime CMS"}
          </span>
        </div>
        <button
          type="button"
          aria-label="Toggle admin menu"
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 rounded-md p-1.5 text-cream-50 hover:bg-cream-50/10"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Click-outside-to-close overlay (mobile only). */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/*
        Off-canvas on mobile (translate-x controlled by `open`), static and
        always visible from `lg` (1024px) up. Pure CSS transform transition —
        no extra JS needed for the slide animation, and it stays smooth even
        on lower-powered phones.
      */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-[82%] max-w-xs shrink-0 flex-col bg-forest-900 text-cream-100 transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2.5 border-b border-cream-50/10 px-5 py-4 lg:px-6 lg:py-5">
          <div className="flex items-center gap-2.5">
            <MarkIcon />
            <span className="font-display text-base font-semibold text-cream-50">
              MariePrime CMS
            </span>
          </div>
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-cream-100 hover:bg-cream-50/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-stub px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-gold-500 text-forest-900"
                    : "text-cream-200/75 hover:bg-cream-50/5 hover:text-cream-50"
                )}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cream-50/10 p-3">
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}

function MarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M15 78 L38 22 L48 22 L25 78 Z" fill="#C9A876" />
      <path d="M40 78 L63 22 L73 22 L50 78 Z" fill="#C9A876" />
      <path d="M55 78 L78 34 L89 58 L73 78 Z" fill="#E3D2B0" />
    </svg>
  );
}
