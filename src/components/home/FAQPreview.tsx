"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { homeFaqs } from "@/lib/data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow className="justify-center">Common Questions</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            Answers before you have to ask.
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-forest-900/10 rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
          {homeFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question} className="px-6 lg:px-8">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base font-semibold text-forest-900 sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-forest-700"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-ink-500">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Button href="/contact" variant="ghost">
            Ask us directly
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
