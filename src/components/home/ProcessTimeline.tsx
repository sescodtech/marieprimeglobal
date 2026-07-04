"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { clientJourney } from "@/lib/data";
import { journeyIconMap } from "@/lib/homeIcons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.35"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-forest-800 py-24 text-cream-50 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow light>Client Journey</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            Six stages. Nothing skipped, nothing left to guesswork.
          </h2>
        </Reveal>

        <div ref={containerRef} className="relative mt-16">
          {/* Progress line — desktop: horizontal, fills left to right on scroll */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-cream-50/10 lg:block"
          >
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full origin-left bg-gradient-to-r from-gold-400 to-gold-300"
            />
          </div>

          {/* Progress line — mobile/tablet: vertical, fills top to bottom on scroll */}
          <div
            aria-hidden
            className="absolute bottom-0 left-6 top-0 w-px bg-cream-50/10 lg:hidden"
          >
            <motion.div
              style={{ scaleY: lineScale }}
              className="w-full origin-top bg-gradient-to-b from-gold-400 to-gold-300"
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-6 lg:gap-6">
            {clientJourney.map((stage, i) => {
              const Icon = journeyIconMap[stage.icon];
              return (
                <Reveal key={stage.title} delay={i * 0.09} className="relative">
                  <div className="flex items-start gap-4 lg:flex-col lg:items-start lg:gap-0">
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-forest-800 text-gold-400">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div className="lg:mt-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-300/70">
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold">
                        {stage.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-cream-200/65 lg:pr-3">
                    {stage.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
