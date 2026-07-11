import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaneTakeoff, CheckCircle2 } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FaqAccordionGroup } from "@/components/faq/FaqAccordionGroup";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ServiceBenefit, ServiceProcessStep, ServiceFaq } from "@/lib/servicePages";
import { getServiceTypeFromPathSlug } from "@/lib/applicationForms/config";

type Params = { slug: string };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({ where: { isPublished: true }, select: { slug: true } });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.isPublished) return {};

  return {
    title: service.metaTitle ?? service.title,
    description: service.metaDescription ?? service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.isPublished) notFound();

  const benefits = asArray<ServiceBenefit>(service.benefits);
  const processSteps = asArray<ServiceProcessStep>(service.process);
  const applicationType = getServiceTypeFromPathSlug(slug);
  const faqs = asArray<ServiceFaq>(service.faqs);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
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
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center lg:px-10 lg:py-20">
          <Reveal>
            <Eyebrow light className="justify-center">
              {service.routeCode}
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight text-cream-50 sm:text-5xl">
              {service.title}
            </h1>
            {service.tagline && (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream-200/75">
                {service.tagline}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex justify-center">
            <div className="relative overflow-hidden rounded-stub bg-cream-50 shadow-stub ring-1 ring-cream-50/10">
              {/* Stub header, matches BoardingPassCard */}
              <div className="flex items-center justify-between gap-8 bg-forest-700 px-6 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">
                  Boarding Pass
                </span>
                <span className="font-mono text-[10px] font-semibold text-cream-50">
                  {service.routeCode}
                </span>
              </div>

              {/* Route line */}
              <div className="flex items-center gap-4 px-6 py-4">
                <span className="font-mono text-2xl font-semibold text-forest-900">
                  {service.routeFrom}
                </span>
                <span className="flex items-center gap-2 text-gold-500">
                  <span className="h-px w-10 route-dashes" />
                  <PlaneTakeoff size={16} />
                  <span className="h-px w-10 route-dashes" />
                </span>
                <span className="font-mono text-2xl font-semibold text-forest-900">
                  {service.routeTo}
                </span>
              </div>

              {/* Perforated edge, matches BoardingPassCard */}
              <div className="perforated-edge h-2.5 w-full" />
            </div>
          </Reveal>

          <Reveal delay={0.18} className="mt-8 flex flex-wrap justify-center gap-4">
            {applicationType && (
              <Button href={`/apply/${slug}`} variant="primary">
                Apply now
              </Button>
            )}
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
            <p className="mt-5 text-lg leading-relaxed text-ink-700">{service.description}</p>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-forest-800 py-20 text-cream-50 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow light>What You Get</Eyebrow>
              <h2 className="mt-4 max-w-lg font-display text-3xl font-medium leading-tight sm:text-4xl">
                Built around the details that actually matter.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {benefits.map((b, i) => (
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
      )}

      {/* Process */}
      {processSteps.length > 0 && (
        <section className="bg-cream-100 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow>How It Works</Eyebrow>
              <h2 className="mt-4 max-w-lg font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
                {processSteps.length} stages, start to finish.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
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
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-cream-50 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <Eyebrow className="justify-center">Questions</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
                About {service.title.toLowerCase()}
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <FaqAccordionGroup items={faqs} defaultOpenIndex={0} />
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-forest-900 py-20 text-center text-cream-50 lg:py-24">
        <Reveal>
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Ready to start with {service.title.toLowerCase()}?
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {applicationType && (
              <Button href={`/apply/${slug}`} variant="secondary">
                Apply now
              </Button>
            )}
            <Button href="/contact" variant="secondary">
              Submit an enquiry
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
