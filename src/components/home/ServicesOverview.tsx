import { prisma } from "@/lib/prisma";
import { BoardingPassCard } from "@/components/ui/BoardingPassCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export async function ServicesOverview() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow>What We Handle</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            {services.length} services. One standard of execution.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.08}>
              <BoardingPassCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
