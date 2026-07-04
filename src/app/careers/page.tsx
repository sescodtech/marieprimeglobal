import type { Metadata } from "next";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ApplyModal } from "@/components/careers/ApplyModal";
import { prisma } from "@/lib/prisma";
import { getContactInfo, getSeoSetting } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("careers");
  return {
    title: seo?.metaTitle ?? "Careers",
    description:
      seo?.metaDescription ??
      "Open roles at MariePrime Global Services across client services and operations, based in Lagos, Nigeria.",
    alternates: { canonical: "/careers" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function CareersPage() {
  const [contact, jobs] = await Promise.all([
    getContactInfo(),
    prisma.jobListing.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <section className="bg-forest-900 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Careers at MariePrime
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Help clients get it right, the first time.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              We're a small, deliberate team. Every role here carries real ownership over a
              client's outcome, not a slice of a ticket queue.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-forest-900">
              Open positions
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-5">
            {jobs.map((job, i) => (
              <Reveal key={job.slug} delay={i * 0.06}>
                <div
                  id={job.slug}
                  className="scroll-mt-24 rounded-stub bg-cream-50 p-7 shadow-card ring-1 ring-forest-900/5 sm:p-8"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-forest-900">
                        {job.title}
                      </h3>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={13} className="text-forest-700" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-forest-700" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} className="text-forest-700" />
                          {job.type}
                        </span>
                      </div>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700">
                        {job.summary}
                      </p>
                    </div>
                    <ApplyModal jobId={job.id} jobTitle={job.title} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {jobs.length === 0 && (
            <p className="mt-10 text-sm text-ink-500">
              No open positions right now — check back soon, or send a general application to{" "}
              <a href={`mailto:${contact.email}`} className="text-forest-700 underline">
                {contact.email}
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <section className="bg-forest-800 py-16 text-center text-cream-50 lg:py-20">
        <Reveal>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-cream-200/70">
            Don't see a role that fits? Send your CV and a short note to{" "}
            <a href={`mailto:${contact.email}`} className="text-gold-300 underline">
              {contact.email}
            </a>{" "}
            — we review every general application.
          </p>
        </Reveal>
      </section>
    </>
  );
}
