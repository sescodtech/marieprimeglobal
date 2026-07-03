import { companyStats } from "@/lib/data";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-forest-700 py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 39px, #F1E7D2 39px, #F1E7D2 40px)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:gap-10 lg:px-10">
        {companyStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center lg:text-left">
            <div className="font-display text-4xl font-semibold text-cream-50 sm:text-5xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-gold-300">
              {stat.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
