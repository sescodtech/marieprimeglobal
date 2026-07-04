import { CheckCircle2 } from "lucide-react";
import { siteContent } from "@/lib/data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function WhyChoose() {
  return (
    <section className="bg-forest-800 py-24 text-cream-50 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow light>Our Commitment</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-4xl">
              The details other agencies skip are the ones we build our process around.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream-200/70">
              Global services fail on small things: a missing document, an unclear timeline,
              a contact who goes quiet. We built our process to close those gaps, every time.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {siteContent.home.whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-xl2 border border-cream-50/10 bg-cream-50/[0.03] p-6 transition-colors duration-300 hover:bg-cream-50/[0.06]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/15 text-gold-400">
                    <CheckCircle2 size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-200/65">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
