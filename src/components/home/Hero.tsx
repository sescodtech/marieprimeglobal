"use client";

import { useEffect, useRef } from "react";
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
// True ease-in-out — the aircraft accelerates away from a standstill and
// settles again before exit, rather than coasting at constant speed. This
// reads as "heavy" rather than "floaty".
const flightEasing = [0.45, 0.05, 0.15, 0.95] as const;

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
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-700 py-16 lg:min-h-[72vh] lg:py-20">
      <SkyBackground />
      <AircraftFlyover reduceMotion={!!reduceMotion} />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
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
            className="mt-5 font-display text-4xl font-medium leading-[1.12] text-cream-50 sm:text-5xl lg:text-[3.35rem]"
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
            className="mt-5 max-w-[560px] text-base leading-relaxed text-cream-200/75 lg:text-lg"
          >
            {heroSubtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easing }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button href="/contact" variant="secondary" className="px-8 py-4">
              Request Consultation
            </Button>
            <Button
              href="/services"
              variant="ghost"
              className="border-cream-50/25 px-8 py-4 text-cream-50 hover:border-gold-400 hover:bg-cream-50/5"
            >
              Explore Our Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easing }}
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-cream-50/10 pt-6"
          >
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-cream-200/75">
                <item.icon size={15} className="text-gold-400" />
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Cinematic full-width flyover. The real aircraft photograph enters
 * completely outside the left edge of the viewport, climbs gently while
 * crossing the entire browser width, and exits completely outside the
 * right edge. It plays once on load and only replays if the visitor
 * scrolls away from the very top of the page and then returns to it —
 * it never loops continuously.
 *
 *   public/images/hero-aircraft.png
 */
function AircraftFlyover({ reduceMotion }: { reduceMotion: boolean }) {
  const controls = useAnimation();
  const hasLeftTop = useRef(false);

  const flightStart = { x: "-60vw", y: "5vh", rotate: -1, opacity: 0 };

  const runFlight = (duration: number) => {
    controls.set(flightStart);
    controls.start({
      x: "160vw",
      y: "-13vh",
      rotate: -5,
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration,
        ease: flightEasing,
        opacity: { duration, times: [0, 0.08, 0.7, 0.9, 1], ease: "linear" },
      },
    });
  };

  // Original pass was 6.5s / 5.5s. Slowed ~60% so the aircraft feels like a
  // real, heavy commercial airliner drifting across the sky rather than a
  // quick floating icon.
  useEffect(() => {
    if (reduceMotion) {
      controls.set({ x: "0vw", y: "0vh", rotate: -3, opacity: 1 });
      return;
    }
    runFlight(16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > 400) {
        hasLeftTop.current = true;
      }
      if (y < 40 && hasLeftTop.current) {
        hasLeftTop.current = false;
        runFlight(14);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-screen -translate-x-1/2 overflow-hidden"
    >
      <motion.div
        animate={controls}
        initial={false}
        className="absolute left-0 top-[20%] h-[110px] w-[220px] sm:top-[16%] sm:h-[150px] sm:w-[300px] lg:top-[14%] lg:h-[220px] lg:w-[440px]"
      >
        {/* Soft ground/air shadow trailing beneath the aircraft */}
        <div className="absolute left-1/2 top-[62%] h-6 w-2/3 -translate-x-1/2 rounded-full bg-black/25 blur-2xl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-aircraft.png"
          alt="MariePrime Global Services — international commercial aircraft"
          className="relative h-full w-full object-contain drop-shadow-[0_35px_45px_rgba(11,30,23,0.5)]"
        />
      </motion.div>
    </div>
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
