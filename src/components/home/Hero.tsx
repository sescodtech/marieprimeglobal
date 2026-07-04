"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, UserCheck, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type HeroProps = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
};

const trustIndicators = [
  { icon: ShieldCheck, label: "Vetted documentation" },
  { icon: UserCheck, label: "One dedicated contact" },
  { icon: FileCheck2, label: "Transparent, written pricing" },
];

const easing = [0.22, 1, 0.36, 1] as const;

export function Hero({ heroEyebrow, heroHeadline, heroSubtext }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const lastAndIndex = heroHeadline.lastIndexOf(" and ");
  const headlineLead = lastAndIndex >= 0 ? heroHeadline.slice(0, lastAndIndex) : heroHeadline;
  const headlineAccent = lastAndIndex >= 0 ? heroHeadline.slice(lastAndIndex + 1) : "";

  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-gradient-to-b from-forest-950 via-forest-900 to-forest-800">
      {/* Ambient texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#E3D2B0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl"
      />

      {/* Full-bleed cinematic aircraft — flies behind the content, entering and exiting past the section edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          initial={{ left: "-22%", top: "38%" }}
          animate={
            reduceMotion
              ? { left: "45%", top: "34%" }
              : { left: ["-22%", "50%", "122%"], top: ["46%", "30%", "38%"] }
          }
          transition={
            reduceMotion
              ? {}
              : { duration: 17, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={reduceMotion ? {} : { rotate: [-2, 3, -2] }}
            transition={reduceMotion ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Aircraft />
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-20 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easing }}
        >
          <Eyebrow light className="justify-center">
            {heroEyebrow}
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easing }}
          className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.12] text-cream-50 sm:text-5xl lg:text-[3.25rem]"
        >
          {headlineLead}
          {headlineAccent && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                {headlineAccent}
              </span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75 lg:text-lg"
        >
          {heroSubtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: easing }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: easing }}
          className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream-50/10 pt-7"
        >
          {trustIndicators.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-cream-200/75">
              <item.icon size={15} className="text-gold-400" />
              <span className="text-xs font-medium tracking-wide">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** A realistic passenger-aircraft silhouette, rendered large and cinematic for the full-bleed hero crossing. */
function Aircraft() {
  return (
    <svg
      viewBox="0 0 400 140"
      className="h-16 w-[19rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:h-24 sm:w-[28rem] lg:h-28 lg:w-[34rem]"
      aria-hidden
    >
      <defs>
        <linearGradient id="fuselageGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF9F5" />
          <stop offset="100%" stopColor="#E3D2B0" />
        </linearGradient>
      </defs>

      {/* horizontal tail stabilizer */}
      <path d="M55,88 L15,112 L70,92 Z" fill="#B08F5C" opacity="0.9" />
      {/* vertical tail fin */}
      <path d="M48,88 L38,30 L70,88 Z" fill="#B08F5C" />
      {/* main wing, swept */}
      <path d="M180,96 L70,150 L120,150 L230,100 Z" fill="#C9A876" />
      <path d="M180,84 L70,34 L120,34 L230,80 Z" fill="#D3BB86" opacity="0.85" />
      {/* engine pods */}
      <ellipse cx="150" cy="112" rx="22" ry="9" fill="#14352A" />
      <ellipse cx="150" cy="60" rx="22" ry="9" fill="#1B4332" opacity="0.9" />
      {/* fuselage */}
      <rect x="45" y="76" width="300" height="26" rx="13" fill="url(#fuselageGrad)" />
      {/* nose cone */}
      <path d="M345,76 L392,89 L345,102 Z" fill="#FBF9F5" />
      {/* cockpit windows */}
      <path d="M360,84 L378,89 L360,94 Z" fill="#0F2A20" opacity="0.6" />
      {/* window row */}
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={80 + i * 16} cy="89" r="2.2" fill="#0F2A20" opacity="0.55" />
      ))}
    </svg>
  );
}
