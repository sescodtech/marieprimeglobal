import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getApplyServiceCards } from "@/lib/applicationForms/serviceCards";
import { getServiceIcon } from "@/lib/homeIcons";

export const metadata: Metadata = {
  title: "Apply for a Service",
  description: "Start your application with MariePrime Global Services — choose a service to get started.",
  alternates: { canonical: "/apply" },
};

export default async function ApplyIndexPage() {
  const services = await getApplyServiceCards();

  return (
    <>
      <section className="bg-forest-900 py-16 text-cream-50 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Apply Now
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Choose a service to get started.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              Complete a short application, upload your documents, and track everything with a reference
              number — no account required.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <Reveal key={service.type} delay={i * 0.06}>
                  <Link
                    href={`/apply/${service.slug}`}
                    className="group flex h-full flex-col rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                      <Icon size={22} />
                    </div>
                    <h2 className="mt-5 font-display text-lg font-semibold text-forest-900">{service.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{service.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700">
                      Start application
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-12 text-center text-sm text-ink-500">
            Already applied?{" "}
            <Link href="/track" className="font-medium text-forest-700 underline underline-offset-4">
              Track your application
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
