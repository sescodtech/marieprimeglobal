import { companyStats } from "@/lib/data";
import { statIconMap } from "@/lib/homeIcons";
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
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:gap-6 lg:px-10">
        {companyStats.map((stat, i) => {
          const Icon = statIconMap[stat.icon];
          return (
            <Reveal key={stat.label} delay={i * 0.08} className="group">
              <div className="flex flex-col items-center gap-4 rounded-xl2 border border-cream-50/10 bg-cream-50/[0.03] px-4 py-8 text-center transition-colors duration-300 group-hover:bg-cream-50/[0.06] lg:px-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <div className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
                  {stat.staticDisplay ? (
                    <span>{stat.staticDisplay}</span>
                  ) : (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
