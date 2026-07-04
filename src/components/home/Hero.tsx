"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  PlaneTakeoff,
  ShieldCheck,
  Globe2,
  UserCheck,
  FileCheck2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type HeroProps = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
};

const trustIndicators = [
  {
    icon: ShieldCheck,
    label: "Vetted Documentation",
    caption: "Built to withstand scrutiny",
  },
  {
    icon: Globe2,
    label: "Six Service Lines",
    caption: "Travel, visas, study, business",
  },
  {
    icon: UserCheck,
    label: "One Dedicated Contact",
    caption: "No handoffs, ever",
  },
  {
    icon: FileCheck2,
    label: "Transparent Pricing",
    caption: "Agreed upfront, in writing",
  },
];

const easing = [0.22, 1, 0.36, 1] as const;

export function Hero({ heroEyebrow, heroHeadline, heroSubtext }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [headlineLead, ...headlineRestParts] = heroHeadline.split(", ");
  const headlineRest = headlineRestParts.join(", ");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-forest-950 via-forest-900 to-forest-800">
      {/* Ambient texture: faint departure-board route lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, #E3D2B0 39px, #E3D2B0 40px)",
        }}
      />
      {/* Ambient texture: soft world dot-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(#E3D2B0 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-10 lg:pb-28 lg:pt-20">
        {/* Content column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <Eyebrow light>{heroEyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing }}
            className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.08] text-cream-50 sm:text-5xl lg:text-[3.4rem]"
          >
            {headlineLead}
            {headlineRest && (
              <>
                ,{" "}
                <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                  {headlineRest}
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="mt-6 max-w-xl text-base leading-relaxed text-cream-200/75 lg:text-lg"
          >
            {heroSubtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easing }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="/contact" variant="secondary">
              Start Your Journey
            </Button>
            <Button
              href="/contact"
              variant="ghost"
              className="border-cream-50/25 text-cream-50 hover:border-gold-400 hover:bg-cream-50/5"
              showArrow={false}
            >
              Book Free Consultation
            </Button>
          </motion.div>

          {/* Rating line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: easing }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="flex gap-0.5 text-gold-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-xs font-medium text-cream-200/70">
              5-star rated by every client we&apos;ve delivered for.
            </span>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: easing }}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-cream-50/10 pt-8 sm:grid-cols-4"
          >
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <item.icon size={18} className="mt-0.5 shrink-0 text-gold-400" />
                <div>
                  <div className="text-[13px] font-semibold leading-snug text-cream-50">
                    {item.label}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-cream-200/60">
                    {item.caption}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual column */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: easing }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-cream-50/10"
          >
            <PlaneCrossing reduceMotion={!!reduceMotion} />
          </motion.div>

          {/* Floating boarding-pass card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, -8, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0.8, delay: 0.55, ease: easing }
                : {
                    opacity: { duration: 0.8, delay: 0.55, ease: easing },
                    y: { duration: 5, delay: 1.2, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            className="absolute -bottom-8 -left-6 w-[88%] max-w-sm overflow-hidden rounded-stub bg-forest-950/95 shadow-stub ring-1 ring-gold-500/25 backdrop-blur-sm sm:-left-10 sm:w-[80%]"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-400">
                MariePrime Global
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-200/60">
                Journey Starts Here
              </span>
            </div>

            <div className="mt-4 px-5">
              <div className="font-display text-lg font-semibold text-cream-50">
                Your Future
              </div>
              <div className="font-display text-lg italic text-gold-400">
                Our Responsibility
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-5 text-cream-100">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-cream-200/50">
                  From
                </div>
                <div className="font-mono text-sm font-semibold">Dreams</div>
              </div>
              <PlaneTakeoff size={16} className="text-gold-400" />
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-cream-200/50">
                  To
                </div>
                <div className="font-mono text-sm font-semibold">Destination</div>
              </div>
            </div>

            <div className="mt-5 h-px w-full route-dashes opacity-40" />
            <div className="perforated-edge mt-0 h-3 w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Primary hero visual: a plane flying across the frame, entering one side and exiting the other, looping. */
function PlaneCrossing({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950">
      {/* Soft star/dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(#E3D2B0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* Soft cloud glows */}
      <div aria-hidden className="pointer-events-none absolute left-[8%] top-[26%] h-16 w-28 rounded-full bg-cream-50/5 blur-xl" />
      <div aria-hidden className="pointer-events-none absolute right-[12%] top-[62%] h-20 w-32 rounded-full bg-cream-50/5 blur-xl" />
      <div aria-hidden className="pointer-events-none absolute left-[30%] top-[72%] h-14 w-24 rounded-full bg-cream-50/5 blur-xl" />

      {/* Flight path */}
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-1/2 h-px route-dashes opacity-30" />

      {/* Flying plane */}
      <motion.div
        initial={{ left: "-18%" }}
        animate={reduceMotion ? { left: "42%" } : { left: ["-18%", "118%"] }}
        transition={reduceMotion ? {} : { duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={
            reduceMotion
              ? {}
              : { y: [0, -9, 0, 7, 0], rotate: [-3, 2, -1, 3, -3] }
          }
          transition={
            reduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg
            viewBox="0 0 160 60"
            className="h-9 w-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] sm:h-11 sm:w-28"
            aria-hidden
          >
            {/* tail fin */}
            <path d="M18,25 L18,6 L36,25 Z" fill="#D3BB86" />
            {/* horizontal stabilizer */}
            <path d="M20,36 L6,46 L30,36 Z" fill="#D3BB86" />
            {/* main wing */}
            <path d="M58,31 L26,54 L82,33 Z" fill="#D3BB86" />
            {/* engine pod */}
            <ellipse cx="60" cy="42" rx="8" ry="4" fill="#1B4332" />
            {/* fuselage */}
            <rect x="18" y="25" width="95" height="11" rx="5.5" fill="#F1E7D2" />
            {/* nose cone */}
            <path d="M113,25 L138,30.5 L113,36 Z" fill="#F1E7D2" />
            {/* windows */}
            {[45, 55, 65, 75, 85, 95].map((cx) => (
              <circle key={cx} cx={cx} cy="28.5" r="1.2" fill="#0F2A20" />
            ))}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
