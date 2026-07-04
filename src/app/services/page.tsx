import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PremiumServiceCard } from "@/components/ui/PremiumServiceCard";
import { getHomeServices } from "@/lib/content";
import { getServiceIcon } from "@/lib/homeIcons";
import { getSeoSetting } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("services");
  return {
    title: seo?.metaTitle ?? "Services",
    description:
      seo?.metaDescription ??
      "Flight booking, visa and immigration assistance, travel loans, study abroad support and business registration from MariePrime Global Services.",
    alternates: { canonical: "/services" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function ServicesPage() {
  // getHomeServices() already falls back to the default catalogue whenever the
  // database has no published Service rows, so this list is never empty.
  const services = await getHomeServices();

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
        url: `${siteUrl}${service.href}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={servicesSchema} />
      <section className="bg-forest-900 py-16 text-cream-50 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Our Services
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Comprehensive services, each run to the same standard.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              Every engagement starts with a clear scope and timeline before any work begins.
              Tap into any service below for the full breakdown.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05} className="h-full">
                <PremiumServiceCard
                  href={service.href}
                  title={service.title}
                  summary={service.summary}
                  icon={getServiceIcon(service.icon)}
                />
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
