import { CheckCircle2, UserCircle } from "lucide-react";
import Image from "next/image";
import { aboutPreview, directorProfile as fallbackDirector } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export async function AboutPreview() {
  const director =
    (await prisma.directorProfile.findFirst({ where: { isActive: true } })) ?? fallbackDirector;

  return (
    <section className="bg-cream-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
          <Reveal>
            <Eyebrow>{aboutPreview.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
              {aboutPreview.headline}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-700">
              {aboutPreview.body}
            </p>

            <ul className="mt-7 space-y-3">
              {aboutPreview.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Button href="/about" variant="ghost">
                More About Us
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-6 rounded-xl2 bg-forest-800 p-7 text-cream-50 shadow-premium sm:p-8">
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-full bg-forest-700 sm:w-28">
                {director.photoUrl ? (
                  <Image
                    src={director.photoUrl}
                    alt={director.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <UserCircle size={40} className="text-cream-50/30" />
                  </div>
                )}
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300">
                  {director.position}
                </span>
                <h3 className="mt-1.5 font-display text-xl font-semibold">{director.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-200/70">
                  Leading MariePrime Global Services with a focus on structure, honesty and
                  consistent execution.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
