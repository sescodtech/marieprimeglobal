"use client";

import { motion } from "framer-motion";
import { whyChooseGlobal } from "@/lib/data";
import { pillarIconMap } from "@/lib/homeIcons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function WhyChooseGlobal() {
  return (
    <section className="bg-cream-100 pt-10 pb-10 lg:pt-14 lg:pb-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Why Choose Us</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            Why Choose Marie Prime Global
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            A single standard applied to every client, every service, every time — the reasons
            individuals and organisations trust us with their most important journeys.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseGlobal.map((pillar, i) => {
            const Icon = pillarIconMap[pillar.icon];
            return (
              <Reveal key={pillar.title} delay={i * 0.08} className="h-full">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col rounded-xl2 bg-cream-50 p-7 shadow-card ring-1 ring-forest-900/5 transition-shadow duration-300 hover:shadow-premium"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/12 text-gold-600">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-forest-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                    {pillar.description}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
