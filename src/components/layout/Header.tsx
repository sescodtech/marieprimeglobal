"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header({ whatsapp: _whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          ? "border-b border-forest-900/[0.06] bg-cream-50/75 shadow-[0_1px_0_rgba(15,42,32,0.04)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent backdrop-blur-0"
      )}
    >
      <div className="mx-auto container-lg flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-3.5">
          <MarkIcon />
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-lg font-medium tracking-tight transition-colors duration-500",
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

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} scrolled={scrolled} />
          ))}
        </nav>

        <button
          aria-label="Toggle navigation menu"
          className={cn("lg:hidden transition-colors duration-500", scrolled ? "text-forest-900" : "text-cream-50")}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
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
            className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-auto bg-cream-50 p-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <MarkIcon />
                <span className="font-display text-lg font-medium text-forest-900">MariePrime</span>
              </Link>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-forest-900">
                <X size={22} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 font-body text-base font-medium text-ink-700 hover:bg-forest-700/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, label, scrolled }: { href: string; label: string; scrolled: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center px-1 py-1 font-body text-[13px] font-medium tracking-wide transition-colors duration-500",
        scrolled ? "text-ink-700" : "text-cream-100"
      )}
    >
      <span className="relative z-10">{label}</span>
      <motion.span
        layoutId={`underline-${label}`}
        className="absolute left-0 right-0 bottom-0 z-0 h-0.5 bg-gold-400 opacity-0"
        whileHover={{ opacity: 1, height: 3 }}
        transition={{ duration: 0.18 }}
        aria-hidden
      />
    </Link>
  );
}

function MarkIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" aria-hidden>
      <rect width="100" height="100" rx="18" fill="#EAF7F0" />
      <path d="M20 75 L40 25 L50 25 L30 75 Z" fill="#1B4332" />
      <path d="M45 75 L65 25 L75 25 L55 75 Z" fill="#14352A" />
    </svg>
  );
}
