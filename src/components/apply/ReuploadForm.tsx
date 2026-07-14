"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { DocumentFieldConfig, ServiceApplicationType } from "@/lib/applicationForms/types";
import { DocumentUploadField, EMPTY_DOC_STATE, type DocFieldState } from "@/components/apply/DocumentUploadField";

export function ReuploadForm({
  token,
  serviceType,
  documents,
  existing,
}: {
  token: string;
  serviceType: ServiceApplicationType;
  documents: DocumentFieldConfig[];
  existing: Record<string, { url: string; mimeType: string | null; fileName: string }>;
}) {
  const [docState, setDocState] = useState<Record<string, DocFieldState>>(() =>
    Object.fromEntries(
      documents.map((d) => {
        const prior = existing[d.id];
        return [
          d.id,
          prior
            ? { status: "uploaded" as const, progress: 100, url: prior.url, mimeType: prior.mimeType ?? undefined, fileName: prior.fileName }
            : EMPTY_DOC_STATE,
        ];
      })
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const payload: Record<string, { url: string; publicId?: string; mimeType?: string; fileName?: string }> = {};
    for (const doc of documents) {
      const state = docState[doc.id];
      if (state?.status === "uploaded" && state.url) {
        payload[doc.id] = { url: state.url, publicId: state.publicId, mimeType: state.mimeType, fileName: state.fileName };
      }
    }
    if (Object.keys(payload).length === 0) {
      setError("Please upload at least one document.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`/api/applications/upload-link/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: payload }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-stub bg-cream-50 p-8 text-center shadow-card ring-1 ring-forest-900/5">
        <CheckCircle2 size={40} className="mx-auto text-forest-700" />
        <h2 className="mt-4 font-display text-xl font-semibold text-forest-900">Documents received</h2>
        <p className="mt-2 text-sm text-ink-500">
          Thank you — our team has been notified and will continue reviewing your application.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-9">
      <div className="space-y-5">
        {documents.map((doc) => (
          <DocumentUploadField
            key={doc.id}
            config={doc}
            serviceType={serviceType}
            value={docState[doc.id] ?? EMPTY_DOC_STATE}
            onChange={(next) => setDocState((prev) => ({ ...prev, [doc.id]: next }))}
          />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 inline-flex items-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Submitting…" : "Submit documents"}
      </button>
    </div>
  );
}
