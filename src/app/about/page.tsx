import type { Metadata } from "next";
import { Target, Eye, Gem, UserCircle } from "lucide-react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteContent, directorProfile as fallbackDirector } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { getSeoSetting } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("about");
  return {
    title: seo?.metaTitle ?? "About Us",
    description:
      seo?.metaDescription ??
      "Learn about MariePrime Global Services — our mission, vision, values, and the director behind our global mobility and business advisory practice.",
    alternates: { canonical: "/about" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function AboutPage() {
  const director = (await prisma.directorProfile.findFirst({ where: { isActive: true } })) ?? fallbackDirector;

  return (
    <>
      {/* Company profile header */}
      <section className="bg-forest-900 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              About MariePrime
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Built for clients who need it done properly the first time.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              MariePrime Global Services Ltd supports individuals and businesses through
              flight booking, visa and immigration processes, travel financing, study
              placements, business registration and investment advisory — under one roof,
              with one point of accountability.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <div className="h-full rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5">
              <Target size={26} className="text-forest-700" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-forest-900">
                Mission
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {siteContent.about.mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5">
              <Eye size={26} className="text-forest-700" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-forest-900">
                Vision
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {siteContent.about.vision}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-forest-800 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <Eyebrow light>Our Values</Eyebrow>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-medium leading-tight sm:text-4xl">
              Four commitments that don't flex per client.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.about.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <div className="rounded-stub border border-cream-50/10 bg-cream-50/[0.03] p-6">
                  <Gem size={20} className="text-gold-400" />
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-200/65">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Director profile */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Reveal>
            <Eyebrow>Leadership</Eyebrow>
          </Reveal>
          <div className="mt-8 grid gap-10 rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5 sm:grid-cols-[240px_1fr] sm:gap-12 sm:p-10">
            <Reveal>
              {/*
                Champagne-gold frame around the portrait — the client asked
                for this specific area to feel premium/gold rather than the
                plain white card background. Kept intentionally subtle: a
                soft cream-to-gold gradient mat, not a bright/metallic gold.
              */}
              <div className="rounded-xl2 bg-gradient-to-br from-[#FAF7F2] via-[#F8F4E8] to-[#D4AF37]/25 p-3 shadow-premium ring-1 ring-[#C9A227]/20">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-stub bg-forest-800 shadow-inner">
                  {/* Director photo — managed via the CMS (DirectorProfile.photoUrl, served through Cloudinary) */}
                  {director.photoUrl ? (
                    <Image
                      src={director.photoUrl}
                      alt={director.name}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <UserCircle size={48} className="text-cream-50/30" />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">
                {director.name}
              </h2>
              <span className="mt-2 block font-mono text-xs uppercase tracking-[0.2em] text-gold-600">
                {director.position}
              </span>
              <div className="mt-4 h-px w-12 bg-gold-400/60" />
              <p className="mt-5 text-sm leading-7 text-ink-700">{director.biography}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
