import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TrackForm } from "@/components/apply/TrackForm";

export const metadata: Metadata = {
  title: "Track Your Application",
  description: "Check the status of your MariePrime Global Services application.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <>
      <section className="bg-forest-900 py-16 text-cream-50 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              Track Application
            </Eyebrow>
            <h1 className="mt-5 font-display text-3xl font-medium leading-tight sm:text-4xl">
              Check your application status.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-cream-200/75">
              Enter your reference number and the email address you applied with.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="px-6 lg:px-10">
          <Reveal>
            <TrackForm initialReference={ref} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
