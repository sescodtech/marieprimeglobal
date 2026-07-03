"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export type FaqAccordionItem = {
  question: string;
  answer: string;
};

type FaqAccordionGroupProps = {
  items: FaqAccordionItem[];
  defaultOpenIndex?: number | null;
};

export function FaqAccordionGroup({ items, defaultOpenIndex = null }: FaqAccordionGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  if (!items?.length) return null;

  return (
    <div className="divide-y divide-forest-900/10 rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
      {items.map((faq, i) => {
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
                  <p className="pb-5 text-sm leading-relaxed text-ink-500">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
