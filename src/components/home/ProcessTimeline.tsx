import { processSteps } from "@/lib/data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessTimeline() {
  return (
    <section className="bg-forest-800 py-24 text-cream-50 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow light>How It Works</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            Five stages. No detail skipped in between.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* Route line spanning the timeline — desktop only */}
          <div
            aria-hidden
            className="route-dashes absolute left-0 right-0 top-6 hidden lg:block"
          />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1} className="relative">
                <div className="flex items-center gap-4 lg:block lg:gap-0">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-forest-800 font-mono text-sm font-semibold text-gold-400">
                    {s.step}
                  </div>
                  <h3 className="font-display text-lg font-semibold lg:mt-5">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-cream-200/65 lg:pr-4">
                  {s.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
