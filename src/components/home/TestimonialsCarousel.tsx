"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export type TestimonialCardData = {
  id: string;
  rating: number;
  quote: string;
  clientName: string;
  clientRole: string;
};

/**
 * Swipeable, arrow-navigable testimonial carousel.
 * - Native horizontal scroll-snap does the heavy lifting, so touch/trackpad
 *   swipe works for free on mobile without any gesture library.
 * - Prev/Next arrows scroll by exactly one card width.
 * - Dots reflect the currently-snapped card and are clickable.
 */
export function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const next = Math.min(Math.max(activeIndex + direction, 0), testimonials.length - 1);
    scrollToIndex(next);
  };

  // Keep the dots/active state in sync with manual swipe/scroll, not just button clicks.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[];
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDistance = Infinity;
        cards.forEach((card, i) => {
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const distance = Math.abs(cardCenter - trackCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="relative flex h-full w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-xl2 bg-cream-50 p-7 shadow-card ring-1 ring-forest-900/5 sm:w-[380px]"
          >
            <Quote
              aria-hidden
              size={64}
              className="pointer-events-none absolute -right-3 -top-3 text-forest-900/[0.04]"
            />
            <div className="relative flex gap-0.5 text-gold-500">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="relative mt-4 flex-1 text-sm leading-relaxed text-ink-700">
              “{t.quote}”
            </blockquote>
            <figcaption className="relative mt-6 border-t border-forest-900/10 pt-4">
              <span className="block font-display text-base font-semibold text-forest-900">
                {t.clientName}
              </span>
              {t.clientRole && (
                <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
                  {t.clientRole}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Arrow controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={activeIndex === 0}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 text-forest-800 transition-colors hover:border-gold-500 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-forest-900/15 disabled:hover:text-forest-800"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-gold-500" : "w-1.5 bg-forest-900/15"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={activeIndex === testimonials.length - 1}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 text-forest-800 transition-colors hover:border-gold-500 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-forest-900/15 disabled:hover:text-forest-800"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
