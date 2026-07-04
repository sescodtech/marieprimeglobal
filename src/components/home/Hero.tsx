"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { Stamp, PlaneTakeoff, Truck, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type HeroProps = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
};

const trustIndicators = [
  { icon: Stamp, label: "Visa Processing" },
  { icon: PlaneTakeoff, label: "Flight Booking" },
  { icon: Truck, label: "Logistics" },
  { icon: Globe2, label: "Worldwide Support" },
];

const easing = [0.22, 1, 0.36, 1] as const;

// Lines from the last "&" onward are rendered with the gold gradient accent.
function splitHeadline(headline: string) {
  const lines = headline.split("\n").filter(Boolean);
  const accentStart = lines.findIndex((line) => line.includes("&"));
  return { lines, accentStart: accentStart === -1 ? lines.length : accentStart };
}

export function Hero({ heroEyebrow, heroHeadline, heroSubtext }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const { lines, accentStart } = splitHeadline(heroHeadline);

  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-700">
      <SkyBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-10">
        {/* Content — left aligned */}
        <div className="relative z-20 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <Eyebrow light>{heroEyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing }}
            className="mt-6 font-display text-4xl font-medium leading-[1.15] text-cream-50 sm:text-5xl lg:text-[3.15rem]"
          >
            {lines.map((line, i) => (
              <span
                key={line}
                className={
                  i >= accentStart
                    ? "block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent"
                    : "block"
                }
              >
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="mt-6 max-w-[620px] text-base leading-relaxed text-cream-200/75 lg:text-lg"
          >
            {heroSubtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easing }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="/contact" variant="secondary">
              Request Consultation
            </Button>
            <Button
              href="/services"
              variant="ghost"
              className="border-cream-50/25 text-cream-50 hover:border-gold-400 hover:bg-cream-50/5"
            >
              Explore Our Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easing }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-cream-50/10 pt-7"
          >
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-cream-200/75">
                <item.icon size={15} className="text-gold-400" />
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Aircraft — visual centerpiece, right side */}
        <div className="relative hidden h-[320px] lg:block lg:h-[420px]">
          <Aircraft reduceMotion={!!reduceMotion} />
        </div>
      </div>

      {/* Compact aircraft for tablet/mobile — reduced size, never overlaps text */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 opacity-70 lg:hidden">
        <Aircraft reduceMotion={!!reduceMotion} compact />
      </div>
    </section>
  );
}

/**
 * Real commercial-aircraft photograph, animated flying in from off-screen and
 * settling into its resting position. Replace the placeholder file below with
 * a high-resolution transparent-background PNG of a wide-body passenger jet
 * (Emirates/Qatar Airways/Boeing/Airbus style) — recommended size 1600x900+.
 *
 *   public/images/hero-aircraft.png
 */
function Aircraft({ reduceMotion, compact = false }: { reduceMotion: boolean; compact?: boolean }) {
  const controls = useAnimation();
  const hasLeftTop = useRef(false);
  const [mounted, setMounted] = useState(false);

  const restingState = compact
    ? { x: "0%", y: "0%", rotate: -2, opacity: 0.9 }
    : { x: "0%", y: "0%", rotate: -3, opacity: 1 };

  useEffect(() => {
    setMounted(true);
    if (reduceMotion) {
      controls.set(restingState);
      return;
    }
    controls.set({ x: "-60%", y: "6%", rotate: -6, opacity: 0 });
    controls.start({
      ...restingState,
      transition: { duration: 2.2, ease: easing },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > 400) {
        hasLeftTop.current = true;
      }
      if (y < 40 && hasLeftTop.current && mounted) {
        hasLeftTop.current = false;
        controls.set({ x: "-60%", y: "6%", rotate: -6, opacity: 0 });
        controls.start({
          ...restingState,
          transition: { duration: 1.8, ease: easing },
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, reduceMotion]);

  return (
    <motion.div animate={controls} className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={reduceMotion ? {} : { y: [0, -10, 0] }}
        transition={reduceMotion ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-aircraft.png"
          alt="MariePrime Global Services — international commercial aircraft"
          className="h-full w-full object-contain drop-shadow-[0_35px_45px_rgba(11,30,23,0.45)]"
        />
      </motion.div>
    </motion.div>
  );
}

/** Premium sunrise sky — soft gradients and slow-floating cloud blur shapes. */
function SkyBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Sunrise gradient wash toward the right, where the aircraft sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gold-500/[0.08]" />
      <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(ellipse_at_top_right,_rgba(211,187,134,0.16),_transparent_60%)]" />

      {/* Fine horizon glow */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold-400/[0.06] to-transparent" />

      {/* Subtle floating clouds */}
      <motion.div
        animate={{ x: [0, 24, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[18%] h-24 w-64 rounded-full bg-cream-50/[0.06] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[12%] top-[32%] h-32 w-80 rounded-full bg-gold-200/[0.07] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[15%] left-[30%] h-20 w-56 rounded-full bg-cream-50/[0.05] blur-3xl"
      />

      {/* Faint star/texture dots for depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#E3D2B0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
