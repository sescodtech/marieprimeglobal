"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Copy, ClipboardCheck } from "lucide-react";
import type { ServiceApplicationType, FormSection, DocumentFieldConfig } from "@/lib/applicationForms/types";
import { buildApplicationSchema, fieldIdsForSection } from "@/lib/applicationForms/schema";
import { FormField } from "@/components/apply/FormField";
import { DocumentUploadField, EMPTY_DOC_STATE, type DocFieldState } from "@/components/apply/DocumentUploadField";

type Step = { kind: "section"; section: FormSection } | { kind: "documents" } | { kind: "review" };

type DraftShape = {
  values: Record<string, string>;
  documents: Record<string, DocFieldState>;
};

export function ApplicationWizard({
  serviceType,
  serviceTitle,
  sections,
  documents: documentConfigs,
}: {
  serviceType: ServiceApplicationType;
  serviceTitle: string;
  sections: FormSection[];
  documents: DocumentFieldConfig[];
}) {
  const draftKey = `mpg-apply-draft-${serviceType}`;
  const schema = useMemo(() => buildApplicationSchema(sections), [sections]);

  const steps: Step[] = useMemo(
    () => [...sections.map((section): Step => ({ kind: "section", section })), { kind: "documents" }, { kind: "review" }],
    [sections]
  );

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({ resolver: zodResolver(schema), mode: "onTouched" });

  const [stepIndex, setStepIndex] = useState(0);
  const [docState, setDocState] = useState<Record<string, DocFieldState>>(() =>
    Object.fromEntries(documentConfigs.map((d) => [d.id, EMPTY_DOC_STATE]))
  );
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const restored = useRef(false);

  // Restore an in-progress draft on mount. Document uploads are already
  // sitting in Cloudinary at this point, so restoring their metadata is
  // enough — nothing needs to be re-uploaded.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return;
      const draft: DraftShape = JSON.parse(raw);
      reset(draft.values);
      setDocState((prev) => ({ ...prev, ...draft.documents }));
    } catch {
      // Corrupt or unreadable draft — ignore and start fresh.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave the draft (debounced) whenever field values or document state
  // change, so a closed tab doesn't lose progress.
  const watchedValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const draft: DraftShape = { values: watchedValues, documents: docState };
        window.localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {
        // Storage full or unavailable — autosave is a convenience, not critical.
      }
    }, 600);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues), JSON.stringify(docState)]);

  const totalSteps = steps.length;
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const currentStep = steps[stepIndex];

  async function goNext() {
    if (currentStep.kind === "section") {
      const valid = await trigger(fieldIdsForSection(currentStep.section));
      if (!valid) return;
    }
    if (currentStep.kind === "documents") {
      const missing = documentConfigs.filter((d) => d.required && docState[d.id]?.status !== "uploaded");
      if (missing.length > 0) {
        setDocumentsError(`Please upload: ${missing.map((d) => d.label).join(", ")}.`);
        return;
      }
      setDocumentsError(null);
    }
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function onFinalSubmit(values: Record<string, string>) {
    if (!declarationAccepted) {
      setSubmitError("Please accept the declaration before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const documentsPayload: Record<string, { url: string; publicId?: string; mimeType?: string; fileName?: string }> =
      {};
    for (const doc of documentConfigs) {
      const state = docState[doc.id];
      if (state?.status === "uploaded" && state.url) {
        documentsPayload[doc.id] = {
          url: state.url,
          publicId: state.publicId,
          mimeType: state.mimeType,
          fileName: state.fileName,
        };
      }
    }

    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType, values, documents: documentsPayload }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");

      try {
        window.localStorage.removeItem(draftKey);
      } catch {
        /* ignore */
      }
      setReferenceNumber(body.referenceNumber);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyReference() {
    if (!referenceNumber) return;
    void navigator.clipboard.writeText(referenceNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (referenceNumber) {
    return (
      <div className="mx-auto max-w-lg rounded-stub bg-cream-50 p-8 text-center shadow-card ring-1 ring-forest-900/5 sm:p-12">
        <CheckCircle2 size={48} className="mx-auto text-forest-700" />
        <h2 className="mt-6 font-display text-2xl font-semibold text-forest-900">Application submitted</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          We've sent a confirmation to your email. Keep your reference number safe — you'll need it to track your
          application.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 rounded-stub bg-forest-700/5 px-5 py-4">
          <span className="font-mono text-lg font-semibold text-forest-900">{referenceNumber}</span>
          <button
            type="button"
            onClick={copyReference}
            className="text-forest-700 hover:text-forest-900"
            title="Copy reference number"
          >
            {copied ? <ClipboardCheck size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/track?ref=${encodeURIComponent(referenceNumber)}`}
            className="inline-flex items-center justify-center gap-2 rounded-stub bg-forest-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-forest-800"
          >
            Track this application
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-stub border border-forest-700/25 px-6 py-3 text-sm font-semibold text-forest-700 hover:border-forest-700"
          >
            Apply for another service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span className="font-mono uppercase tracking-wider">
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-forest-900/10">
          <div
            className="h-full rounded-full bg-forest-700 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onFinalSubmit)}
        className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-9"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
          >
            {currentStep.kind === "section" && (
              <div>
                <h2 className="font-display text-xl font-semibold text-forest-900">{currentStep.section.title}</h2>
                {currentStep.section.description && (
                  <p className="mt-1 text-sm text-ink-500">{currentStep.section.description}</p>
                )}
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {currentStep.section.fields.map((field) => (
                    <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                      <FormField field={field} register={register} errors={errors} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.kind === "documents" && (
              <div>
                <h2 className="font-display text-xl font-semibold text-forest-900">Required Documents</h2>
                <p className="mt-1 text-sm text-ink-500">JPG, PNG or PDF, up to 8MB each.</p>
                <div className="mt-6 space-y-5">
                  {documentConfigs.map((doc) => (
                    <DocumentUploadField
                      key={doc.id}
                      config={doc}
                      value={docState[doc.id] ?? EMPTY_DOC_STATE}
                      onChange={(next) => setDocState((prev) => ({ ...prev, [doc.id]: next }))}
                    />
                  ))}
                </div>
                {documentsError && <p className="mt-4 text-sm text-red-600">{documentsError}</p>}
              </div>
            )}

            {currentStep.kind === "review" && (
              <ReviewStep
                serviceTitle={serviceTitle}
                sections={sections}
                values={watchedValues}
                documentConfigs={documentConfigs}
                docState={docState}
                declarationAccepted={declarationAccepted}
                onDeclarationChange={setDeclarationAccepted}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {submitError && <p className="mt-6 text-sm text-red-600">{submitError}</p>}

        <div className="mt-8 flex items-center justify-between border-t border-forest-900/10 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-forest-900 disabled:opacity-0"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          {currentStep.kind === "review" ? (
            <button
              type="submit"
              disabled={submitting || !declarationAccepted}
              className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800"
            >
              Continue
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ReviewStep({
  serviceTitle,
  sections,
  values,
  documentConfigs,
  docState,
  declarationAccepted,
  onDeclarationChange,
}: {
  serviceTitle: string;
  sections: FormSection[];
  values: Record<string, string>;
  documentConfigs: DocumentFieldConfig[];
  docState: Record<string, DocFieldState>;
  declarationAccepted: boolean;
  onDeclarationChange: (value: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-forest-900">Review your application</h2>
      <p className="mt-1 text-sm text-ink-500">Applying for {serviceTitle}. Check everything before you submit.</p>

      <div className="mt-6 space-y-6">
        {sections.map((section) => (
          <div key={section.id}>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">
              {section.title}
            </h3>
            <dl className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {section.fields
                .filter((f) => values[f.id])
                .map((field) => (
                  <div key={field.id}>
                    <dt className="text-xs text-ink-500">{field.label}</dt>
                    <dd className="text-sm text-forest-900">{values[field.id]}</dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}

        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Documents</h3>
          <ul className="mt-2 space-y-1 text-sm text-forest-900">
            {documentConfigs.map((doc) => {
              const state = docState[doc.id];
              return (
                <li key={doc.id} className="flex items-center gap-2">
                  {state?.status === "uploaded" ? (
                    <CheckCircle2 size={14} className="text-forest-700" />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-ink-500/30" />
                  )}
                  {doc.label}
                  {state?.status === "uploaded" && <span className="text-xs text-ink-500">— {state.fileName}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <label className="mt-8 flex items-start gap-3 rounded-stub bg-forest-700/5 p-4">
        <input
          type="checkbox"
          checked={declarationAccepted}
          onChange={(e) => onDeclarationChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-700/40 text-forest-700 focus:ring-forest-700"
        />
        <span className="text-sm text-ink-700">
          I confirm the information provided is accurate and complete to the best of my knowledge, and I authorize
          MariePrime Global Services to process this application.
        </span>
      </label>
    </div>
  );
}
