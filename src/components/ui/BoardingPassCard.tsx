import Link from "next/link";
import { ArrowRight, PlaneTakeoff } from "lucide-react";

type BoardingPassService = {
  slug: string;
  title: string;
  routeCode: string;
  routeFrom: string;
  routeTo: string;
  summary: string;
};

export function BoardingPassCard({ service }: { service: BoardingPassService }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-stub"
    >
      {/* Stub header: route code */}
      <div className="flex items-center justify-between bg-forest-700 px-6 py-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300">
          Boarding Pass
        </span>
        <span className="font-mono text-xs font-semibold text-cream-50">
          {service.routeCode}
        </span>
      </div>

      {/* Route line */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="font-mono text-2xl font-semibold text-forest-900">
          {service.routeFrom}
        </div>
        <div className="mx-3 flex flex-1 items-center gap-2 text-gold-500">
          <span className="h-px flex-1 route-dashes" />
          <PlaneTakeoff size={16} className="shrink-0 -rotate-0" />
        </div>
        <div className="font-mono text-2xl font-semibold text-forest-900">
          {service.routeTo}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <h3 className="font-display text-xl font-semibold leading-snug text-forest-900">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {service.summary}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 transition-transform duration-300 group-hover:translate-x-1">
          View service
          <ArrowRight size={14} />
        </span>
      </div>

      {/* Perforation divider */}
      <div className="perforated-edge h-3 w-full" />
    </Link>
  );
}
