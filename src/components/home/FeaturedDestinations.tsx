"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { destinations } from "@/lib/data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FeaturedDestinations() {
  return (
    <section className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Where We Take You</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
              Six destinations. Every one, mapped out in advance.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.code} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-semibold text-forest-900">
                    {d.code}
                  </span>
                  <Globe2
                    size={18}
                    className="text-gold-500 transition-transform duration-300 group-hover:rotate-12"
                  />
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-forest-900">
                  {d.country}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{d.highlight}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {d.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-forest-700/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-forest-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Button href="/contact" variant="ghost">
            Ask about your destination
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
