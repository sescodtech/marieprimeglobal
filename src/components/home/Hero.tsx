"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  PlaneTakeoff,
  ShieldCheck,
  Globe2,
  UserCheck,
  FileCheck2,
  MessageCircle,
  Star,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type HeroProps = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImageUrl?: string | null;
  whatsapp?: string;
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

export function Hero({ heroEyebrow, heroHeadline, heroSubtext, heroImageUrl, whatsapp }: HeroProps) {
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

      {/* Floating decorative elements — subtle, performant, reduced-motion aware */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-24 hidden text-gold-400/25 lg:block"
        animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <PlaneTakeoff size={64} strokeWidth={1} />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[22%] top-[62%] hidden text-cream-50/10 lg:block"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Globe2 size={40} strokeWidth={1} />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[4%] top-[78%] hidden text-gold-400/20 lg:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <MapPin size={28} strokeWidth={1} />
      </motion.div>

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
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                  "Hi MariePrime, I'd like to book a free consultation."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-stub border border-cream-50/25 px-6 py-3 font-body text-sm font-semibold tracking-wide text-cream-50 transition-all duration-300 hover:border-gold-400 hover:bg-cream-50/5"
              >
                <MessageCircle size={16} className="text-gold-400" />
                Book Free Consultation
              </a>
            ) : (
              <Button
                href="/contact"
                variant="ghost"
                className="border-cream-50/25 text-cream-50 hover:border-gold-400 hover:bg-cream-50/5"
                showArrow={false}
              >
                Book Free Consultation
              </Button>
            )}
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
            {heroImageUrl ? (
              <>
                <Image
                  src={heroImageUrl}
                  alt="MariePrime Global Services — international travel and mobility"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
              </>
            ) : (
              <GlobeComposition reduceMotion={!!reduceMotion} />
            )}
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

/** Decorative globe + flight-path composition used when no hero image is configured. */
function GlobeComposition({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950">
      <svg
        viewBox="0 0 400 400"
        className="h-[85%] w-[85%] opacity-90"
        aria-hidden
      >
        <circle cx="200" cy="200" r="150" fill="none" stroke="#D3BB86" strokeOpacity="0.28" strokeWidth="1.5" />
        <ellipse cx="200" cy="200" rx="150" ry="60" fill="none" stroke="#D3BB86" strokeOpacity="0.2" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="150" ry="110" fill="none" stroke="#D3BB86" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="50" y1="200" x2="350" y2="200" stroke="#D3BB86" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="200" y1="50" x2="200" y2="350" stroke="#D3BB86" strokeOpacity="0.15" strokeWidth="1" />
        <path
          d="M 70 260 Q 200 120 330 200"
          fill="none"
          stroke="#D3BB86"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeDasharray="5 7"
        />
        <motion.g
          animate={
            reduceMotion
              ? {}
              : {
                  offsetDistance: ["0%", "100%"],
                }
          }
          transition={
            reduceMotion
              ? {}
              : { duration: 6, repeat: Infinity, ease: "linear" }
          }
          style={{
            offsetPath: "path('M 70 260 Q 200 120 330 200')",
          }}
        >
          <PlaneTakeoff x={-9} y={-9} size={18} color="#E3D2B0" />
        </motion.g>
      </svg>
    </div>
  );
}
