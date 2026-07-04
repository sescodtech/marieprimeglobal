import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FaqAccordionGroup } from "@/components/faq/FaqAccordionGroup";
import { prisma } from "@/lib/prisma";
import { getSeoSetting } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("faq");
  return {
    title: seo?.metaTitle ?? "Frequently Asked Questions",
    description:
      seo?.metaDescription ??
      "Answers to common questions about visas, study abroad, travel bookings, business registration and working with MariePrime Global Services.",
    alternates: { canonical: "/faq" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <section className="bg-forest-900 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Frequently Asked Questions
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Answers before you have to ask.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              Organised by service area. If your question isn't covered here, send it to us
              directly and a representative will respond within 24–48 hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="flex flex-col gap-14">
            {Object.entries(grouped).map(([category, items], i) => (
              <Reveal key={category} delay={i * 0.06}>
                <h2 className="font-display text-xl font-semibold text-forest-900">{category}</h2>
                <FaqAccordionGroup items={items} className="mt-5" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest-800 py-20 text-center text-cream-50 lg:py-24">
        <Reveal>
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Still have a question?
          </h2>
          <div className="mt-7">
            <Button href="/contact" variant="secondary">
              Send us a message
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
