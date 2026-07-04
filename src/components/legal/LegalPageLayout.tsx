import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import type { LegalPageContent } from "@/lib/legalContent";

export function LegalPageLayout({ content }: { content: LegalPageContent }) {
  return (
    <>
      <section className="bg-forest-900 py-16 text-cream-50 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              {content.eyebrow}
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {content.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-mono uppercase tracking-[0.15em] text-gold-300">
              Last updated: {content.lastUpdated}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[240px_1fr] lg:px-10">
          {/* Table of contents — sticky on desktop */}
          <Reveal className="hidden lg:block">
            <nav className="sticky top-28 rounded-xl2 bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-forest-700">
                On this page
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {content.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-ink-500 transition-colors hover:text-forest-700"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Content */}
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-base leading-relaxed text-ink-700">{content.intro}</p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-10">
              {content.sections.map((section, i) => (
                <Reveal key={section.id} delay={Math.min(i * 0.03, 0.3)}>
                  <div id={section.id} className="scroll-mt-28 border-t border-forest-900/8 pt-8">
                    <h2 className="font-display text-xl font-semibold text-forest-900 sm:text-2xl">
                      {section.heading}
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                      {section.body.map((paragraph, pi) => (
                        <p key={pi} className="text-sm leading-relaxed text-ink-700 sm:text-[15px]">
                          {paragraph}
                        </p>
                      ))}
                      {section.list && (
                        <ul className="mt-1 flex flex-col gap-2">
                          {section.list.map((item, li) => (
                            <li
                              key={li}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700 sm:text-[15px]"
                            >
                              <span
                                aria-hidden
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest-800 py-16 text-center text-cream-50 lg:py-20">
        <Reveal>
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Questions about this page?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream-200/75">
            Our team is happy to clarify anything here before you book a service with us.
          </p>
          <div className="mt-7">
            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
