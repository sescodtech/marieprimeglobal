"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/admin/SignOutButton";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/director", label: "Director Profile", icon: UserCircle },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/account", label: "Account", icon: KeyRound },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-forest-900 text-cream-100">
      <div className="flex items-center gap-2.5 border-b border-cream-50/10 px-6 py-5">
        <MarkIcon />
        <span className="font-display text-base font-semibold text-cream-50">
          MariePrime CMS
        </span>
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
