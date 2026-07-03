"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
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
      id="top"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream-50/95 shadow-card backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto container-lg flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <MarkIcon />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-forest-900">MariePrime</span>
            <span className="-mt-0.5 text-xs font-mono text-ink-500">Global Services</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative font-body text-sm font-medium text-ink-700 transition-colors hover:text-forest-700"
            >
              {link.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>

        <button
          aria-label="Toggle navigation menu"
          className="text-forest-900 md:hidden"
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
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
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
            className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-auto bg-cream-50 p-6 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-2.5 font-body text-sm font-medium text-ink-700 hover:bg-forest-700/5"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: navLinks.length * 0.05, ease: "easeOut" }}
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-3 text-sm font-semibold text-cream-50"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
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
