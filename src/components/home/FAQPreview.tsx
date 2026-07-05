import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FaqAccordionGroup } from "@/components/faq/FaqAccordionGroup";

export async function FAQPreview() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
    take: 4,
  });

  if (faqs.length === 0) return null;

  return (
    <section className="bg-cream-100 pt-10 pb-24 lg:pt-14 lg:pb-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow className="justify-center">Common Questions</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            Answers before you have to ask.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <FaqAccordionGroup items={faqs} defaultOpenIndex={0} />
        </Reveal>

        <Reveal delay={0.14} className="mt-10 flex justify-center">
          <Button href="/faq" variant="ghost">
            View all FAQs
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
