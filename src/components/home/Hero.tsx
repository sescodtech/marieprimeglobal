"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Hero({
  heroEyebrow,
  heroHeadline,
  heroSubtext,
}: {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-900">
      {/* Ambient texture: faint route lines, like a departure board */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, #E3D2B0 39px, #E3D2B0 40px)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow light>{heroEyebrow}</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-cream-50 sm:text-5xl lg:text-6xl"
        >
          {heroHeadline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream-200/75 lg:text-lg"
        >
          {heroSubtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="/contact" variant="secondary">
            Start your request
          </Button>
          <Button href="/services" variant="ghost" className="border-cream-50/25 text-cream-50 hover:border-gold-400 hover:bg-cream-50/5">
            View services
          </Button>
        </motion.div>

        {/* Boarding-pass stub — signature element, present from first view */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 inline-flex max-w-md items-center gap-4 rounded-stub border border-gold-500/30 bg-cream-50/[0.04] px-5 py-4 backdrop-blur-sm"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
            MPG
          </span>
          <span className="h-8 w-px bg-gold-500/30" />
          <span className="font-mono text-sm text-cream-100">ENQUIRY</span>
          <PlaneTakeoff size={15} className="text-gold-400" />
          <span className="font-mono text-sm text-cream-100">RESOLVED</span>
        </motion.div>
      </div>
    </section>
  );
}
