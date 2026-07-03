import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaneTakeoff, CheckCircle2 } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FaqAccordionGroup } from "@/components/faq/FaqAccordionGroup";
import { servicePages } from "@/lib/servicePages";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = { slug: string };

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.overview,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);
  if (!service) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.overview,
    provider: {
      "@type": "TravelAgency",
      name: "MariePrime Global Services",
    },
    url: `${siteUrl}/services/${service.slug}`,
  };

  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, #E3D2B0 39px, #E3D2B0 40px)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center lg:px-10 lg:py-28">
          <Reveal>
            <Eyebrow light className="justify-center">
              {service.routeCode}
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight text-cream-50 sm:text-5xl">
              {service.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream-200/75">
              {service.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-stub border border-gold-500/30 bg-cream-50/[0.04] px-5 py-4 backdrop-blur-sm">
              <span className="font-mono text-2xl font-semibold text-cream-50">
                {service.routeFrom}
              </span>
              <span className="mx-1 flex items-center gap-2 text-gold-400">
                <span className="h-px w-10 route-dashes" />
                <PlaneTakeoff size={16} />
                <span className="h-px w-10 route-dashes" />
              </span>
              <span className="font-mono text-2xl font-semibold text-cream-50">
                {service.routeTo}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.18} className="mt-9">
            <Button href="/contact" variant="secondary">
              Enquire about this service
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-cream-100 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow className="justify-center">Overview</Eyebrow>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">{service.overview}</p>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-forest-800 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <Eyebrow light>What You Get</Eyebrow>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-medium leading-tight sm:text-4xl">
              Built around the details that actually matter.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {service.benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="rounded-stub border border-cream-50/10 bg-cream-50/[0.03] p-6">
                  <CheckCircle2 size={22} className="text-gold-400" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-200/65">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
              {service.process.length} stages, start to finish.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    {step.step}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-forest-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal className="text-center">
            <Eyebrow className="justify-center">Questions</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
              About {service.title.toLowerCase()}
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <FaqAccordionGroup items={service.faqs} defaultOpenIndex={0} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-900 py-20 text-center text-cream-50 lg:py-24">
        <Reveal>
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Ready to start with {service.title.toLowerCase()}?
          </h2>
          <div className="mt-7">
            <Button href="/contact" variant="secondary">
              Submit an enquiry
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
