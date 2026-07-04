"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  whatsapp: _whatsapp,
  logoUrl,
}: {
  whatsapp: string;
  logoUrl?: string | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-forest-900/[0.06] bg-cream-50/75 shadow-[0_8px_30px_-12px_rgba(15,42,32,0.15)] backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-cream-50/10 bg-forest-900/35 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10 lg:py-4">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark logoUrl={logoUrl} />
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-xl font-medium tracking-tight transition-colors duration-500",
                scrolled ? "text-forest-900" : "text-cream-50"
              )}
            >
              MariePrime
            </span>
            <span
              className={cn(
                "-mt-0.5 text-[11px] font-mono tracking-wide transition-colors duration-500",
                scrolled ? "text-ink-500" : "text-cream-200/70"
              )}
            >
              Global Services
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              scrolled={scrolled}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="hidden items-center xl:flex">
          <Button href="/contact" variant="secondary" showArrow={false} className="px-6 py-2.5 text-xs">
            Request Consultation
          </Button>
        </div>

        <button
          aria-label="Toggle navigation menu"
          className={cn(
            "transition-colors duration-500 xl:hidden",
            scrolled ? "text-forest-900" : "text-cream-50"
          )}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 xl:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-auto bg-cream-50 p-6 xl:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                <BrandMark logoUrl={logoUrl} />
                <span className="font-display text-lg font-medium text-forest-900">MariePrime</span>
              </Link>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-forest-900">
                <X size={22} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-3 font-body text-base font-medium transition-colors",
                    pathname === link.href
                      ? "bg-forest-700/8 text-forest-900"
                      : "text-ink-700 hover:bg-forest-700/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 border-t border-forest-900/10 pt-6">
              <Button
                href="/contact"
                variant="secondary"
                showArrow={false}
                className="w-full justify-center"
                onClick={() => setOpen(false)}
              >
                Request Consultation
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  label,
  scrolled,
  active,
}: {
  href: string;
  label: string;
  scrolled: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center px-1 py-1.5 font-body text-[13px] font-medium tracking-wide transition-colors duration-500",
        active
          ? scrolled
            ? "text-forest-900"
            : "text-cream-50"
          : scrolled
            ? "text-ink-700 hover:text-forest-900"
            : "text-cream-100 hover:text-cream-50"
      )}
    >
      <span className="relative z-10">{label}</span>
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-1.5 left-0 right-0 z-0 h-0.5 origin-left scale-x-0 rounded-full bg-gold-400 transition-transform duration-300 ease-out group-hover:scale-x-100",
          active && "scale-x-100"
        )}
      />
    </Link>
  );
}

/** Renders the Admin-uploaded logo when one exists, otherwise the default boarding-pass mark. */
function BrandMark({ logoUrl }: { logoUrl?: string | null }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt="MariePrime Global Services"
        className="h-9 w-auto object-contain sm:h-10"
      />
    );
  }
  return <MarkIcon />;
}

function MarkIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" aria-hidden>
      <rect width="100" height="100" rx="18" fill="#EAF7F0" />
      <path d="M20 75 L40 25 L50 25 L30 75 Z" fill="#1B4332" />
      <path d="M45 75 L65 25 L75 25 L55 75 Z" fill="#14352A" />
    </svg>
  );
}
