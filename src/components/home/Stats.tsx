import { companyStats } from "@/lib/data";
import { statIconMap } from "@/lib/homeIcons";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-forest-700 py-8 lg:py-10">
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-6 sm:flex sm:items-center sm:justify-between sm:divide-x sm:divide-cream-50/10 lg:px-10">
        {companyStats.map((stat, i) => {
          const Icon = statIconMap[stat.icon];
          return (
            <Reveal
              key={stat.label}
              delay={i * 0.06}
              className="group flex-1 sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={16} />
                </span>
                <div className="flex flex-col leading-tight">
                  <div className="font-display text-xl font-semibold text-cream-50 sm:text-2xl">
                    {stat.staticDisplay ? (
                      <span>{stat.staticDisplay}</span>
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    )}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
