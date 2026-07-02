import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow>Client Journeys</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            What it's like to work with us.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-stub bg-cream-50 p-7 shadow-card ring-1 ring-forest-900/5">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-forest-900/10 pt-4">
                  <span className="block font-display text-base font-semibold text-forest-900">
                    {t.clientName}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
                    {t.clientRole}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
