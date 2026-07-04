"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
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

export function Header({ whatsapp }: { whatsapp: string }) {
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
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-cream-50/95 shadow-card backdrop-blur" : "bg-forest-950/30 backdrop-blur-[2px]"
      )}
    >
      <div className="mx-auto container-lg flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <MarkIcon />
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-lg font-semibold transition-colors duration-300",
                scrolled ? "text-forest-900" : "text-cream-50"
              )}
            >
              MariePrime
            </span>
            <span
              className={cn(
                "-mt-0.5 text-xs font-mono transition-colors duration-300",
                scrolled ? "text-ink-500" : "text-cream-200/70"
              )}
            >
              Global Services
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} scrolled={scrolled} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-stub bg-gold-500 px-5 py-2.5 text-sm font-semibold text-forest-900 shadow-stub transition-colors hover:bg-gold-400"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>

        <button
          aria-label="Toggle navigation menu"
          className={cn("lg:hidden transition-colors duration-300", scrolled ? "text-forest-900" : "text-cream-50")}
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
                <span className="font-display text-lg font-semibold text-forest-900">MariePrime</span>
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

            <div className="mt-6 border-t border-forest-900/8 pt-4">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-3 text-sm font-semibold text-cream-50"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
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
        "relative inline-flex items-center px-1 py-1 font-body text-sm font-medium transition-colors duration-300",
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
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" aria-hidden>
      <rect width="100" height="100" rx="18" fill="#EAF7F0" />
      <path d="M20 75 L40 25 L50 25 L30 75 Z" fill="#1B4332" />
      <path d="M45 75 L65 25 L75 25 L55 75 Z" fill="#14352A" />
    </svg>
  );
}
