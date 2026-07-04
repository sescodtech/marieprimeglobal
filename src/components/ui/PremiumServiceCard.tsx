import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PremiumServiceCardProps = {
  href: string;
  title: string;
  summary: string;
  icon: LucideIcon;
};

export function PremiumServiceCard({ href, title, summary, icon: Icon }: PremiumServiceCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl2 bg-cream-50 p-7 shadow-card ring-1 ring-forest-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium hover:ring-forest-700/15"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-forest-700/[0.04] transition-transform duration-500 group-hover:scale-125"
      />

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-forest-700/8 text-forest-700 transition-colors duration-300 group-hover:bg-forest-700 group-hover:text-cream-50">
        <Icon size={24} strokeWidth={1.75} />
      </span>

      <h3 className="relative mt-6 font-display text-lg font-semibold leading-snug text-forest-900">
        {title}
      </h3>
      <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{summary}</p>

      <span className="relative mt-6 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 transition-transform duration-300 group-hover:translate-x-1">
        Learn more
        <ArrowRight size={14} />
      </span>
    </Link>
  );
}
