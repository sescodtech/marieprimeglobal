import type { Metadata } from "next";
import Link from "next/link";
import { PlaneTakeoff, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getSeoSetting } from "@/lib/content";
import { servicePages } from "@/lib/servicePages";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("services");
  return {
    title: seo?.metaTitle ?? "Services",
    description:
      seo?.metaDescription ??
      "Flight booking, visa and immigration assistance, travel loans, study abroad support, business registration and investment advisory from MariePrime Global Services.",
    alternates: { canonical: "/services" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        provider: {
          "@type": "TravelAgency",
          name: "MariePrime Global Services",
        },
        url: `${siteUrl}/services#${service.slug}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={servicesSchema} />
      <section className="bg-forest-900 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Our Services
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Six services, each run to the same standard.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              Every engagement starts with a clear scope and timeline before any work begins.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="flex flex-col gap-6">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05}>
                <div
                  id={service.slug}
                  className="scroll-mt-24 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5"
                >
                  <div className="grid sm:grid-cols-[auto_1fr]">
                    {/* Stub */}
                    <div className="flex flex-row items-center justify-between gap-4 bg-forest-700 px-7 py-6 sm:w-56 sm:flex-col sm:items-start sm:justify-center">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300">
                        {service.routeCode}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-lg font-semibold text-cream-50">
                        {service.routeFrom}
                        <PlaneTakeoff size={14} className="text-gold-400" />
                        {service.routeTo}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 sm:p-8">
                      <h2 className="font-display text-2xl font-semibold text-forest-900">
                        {service.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-ink-700">
                        {service.description}
                      </p>
                      <a
                        href="/contact"
                        className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 transition-transform hover:translate-x-1"
                      >
                        Enquire about this service
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <Eyebrow>In Detail</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
              Every service, its own page.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicePages.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-stub border border-forest-900/10 bg-cream-100 px-5 py-4 transition-colors duration-300 hover:border-gold-400/50 hover:bg-cream-50"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
                      {service.routeCode}
                    </span>
                    <div className="mt-0.5 font-display text-sm font-semibold text-forest-900">
                      {service.title}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-forest-700 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest-800 py-20 text-center text-cream-50 lg:py-24">
        <Reveal>
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Not sure which service fits your situation?
          </h2>
          <div className="mt-7">
            <Button href="/contact" variant="secondary">
              Talk to us first
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
