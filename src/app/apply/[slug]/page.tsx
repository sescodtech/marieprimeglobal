import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { getServiceTypeFromPathSlug, SERVICE_APPLICATION_CONFIGS } from "@/lib/applicationForms/config";
import { getDocumentRequirements } from "@/lib/applicationForms/documents";
import { ApplyFlow } from "@/components/apply/ApplyFlow";
import type { ServiceBenefit } from "@/lib/servicePages";

type Params = { slug: string };

function asBenefitList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return (value as ServiceBenefit[]).map((b) => b.title).filter(Boolean);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const type = getServiceTypeFromPathSlug(slug);
  if (!type) return {};
  const config = SERVICE_APPLICATION_CONFIGS[type];
  return {
    title: `Apply — ${config.title}`,
    description: config.summary,
    alternates: { canonical: `/apply/${slug}` },
  };
}

export default async function ApplyServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const type = getServiceTypeFromPathSlug(slug);
  if (!type) notFound();

  const config = SERVICE_APPLICATION_CONFIGS[type];
  const cmsService = config.cmsSlug ? await prisma.service.findUnique({ where: { slug: config.cmsSlug } }) : null;

  // Super Admin can configure a service as "Enquiry Only" — Apply Now is
  // hidden site-wide for it, and a direct visit here goes to the enquiry
  // form instead. No "unavailable" message, just the right form.
  if (cmsService?.applicationMode === "ENQUIRY_ONLY") {
    redirect(`/contact?service=${config.cmsSlug}`);
  }

  const title = cmsService?.title ?? config.title;
  const description = cmsService?.description ?? config.summary;
  const benefits = asBenefitList(cmsService?.benefits);
  const documents = await getDocumentRequirements(type);

  return (
    <>
      <section className="bg-forest-900 py-16 text-cream-50 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Apply Now
            </Eyebrow>
            <h1 className="mt-5 font-display text-3xl font-medium leading-tight sm:text-4xl">{title}</h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="px-6 lg:px-10">
          <Reveal>
            <ApplyFlow
              serviceType={type}
              title={title}
              description={description}
              benefits={benefits}
              sections={config.sections}
              documents={documents}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
