import { getHomeServices } from "@/lib/content";
import { getServiceIcon } from "@/lib/homeIcons";
import { PremiumServiceCard } from "@/components/ui/PremiumServiceCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export async function ServicesOverview() {
  const services = await getHomeServices();

  return (
    <section className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow>What We Offer</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            Comprehensive solutions, handled to one standard of execution.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500">
            From visa applications to logistics and events, every service is delivered by a
            dedicated team that treats your request as its own.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.06} className="h-full">
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
  );
}
