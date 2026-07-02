import { siteContent } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

export function Trust() {
  return (
    <section className="border-y border-forest-900/10 bg-cream-50 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-3 lg:px-10">
        {siteContent.home.trustStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1} className="text-center sm:text-left">
            <div className="font-display text-4xl font-semibold text-forest-700">
              {stat.value}
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-ink-500">
              {stat.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
