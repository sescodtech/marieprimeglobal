import { Layers, Clock, UserCheck } from "lucide-react";
import { siteContent } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

const icons = [Layers, Clock, UserCheck];

export function Trust() {
  return (
    <section className="border-y border-forest-900/10 bg-cream-50 py-12 lg:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-forest-900/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
        {siteContent.home.trustStats.map((stat, i) => {
          const Icon = icons[i] ?? Layers;
          return (
            <Reveal
              key={stat.label}
              delay={i * 0.1}
              className="flex items-center gap-4 py-6 first:pt-0 last:pb-0 sm:justify-center sm:px-8 sm:py-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-700/8 text-forest-700">
                <Icon size={20} />
              </span>
              <div>
                <div className="font-display text-3xl font-semibold text-forest-700">
                  {stat.value}
                </div>
                <div className="mt-0.5 font-mono text-xs uppercase tracking-[0.2em] text-ink-500">
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
