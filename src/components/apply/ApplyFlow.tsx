"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ServiceApplicationType, FormSection, DocumentFieldConfig } from "@/lib/applicationForms/types";
import { ApplicationWizard } from "@/components/apply/ApplicationWizard";

export function ApplyFlow({
  serviceType,
  title,
  description,
  benefits,
  sections,
  documents,
}: {
  serviceType: ServiceApplicationType;
  title: string;
  description: string;
  benefits: string[];
  sections: FormSection[];
  documents: DocumentFieldConfig[];
}) {
  const [started, setStarted] = useState(false);

  if (started) {
    return <ApplicationWizard serviceType={serviceType} serviceTitle={title} sections={sections} documents={documents} />;
  }

  return (
    <div className="mx-auto max-w-2xl rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-9">
      <p className="text-sm leading-relaxed text-ink-700">{description}</p>

      {benefits.length > 0 && (
        <ul className="mt-6 space-y-2.5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-ink-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-700" />
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setStarted(true)}
        className="mt-8 inline-flex items-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800"
      >
        Continue to application
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
