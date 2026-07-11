"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle2, Clock } from "lucide-react";
import { STATUS_LABELS, STATUS_NEXT_STEP, statusBadgeClass, type ServiceApplicationStatus } from "@/lib/applicationForms/status";

type TrackResult = {
  referenceNumber: string;
  serviceTitle: string;
  status: ServiceApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  timeline: { status: ServiceApplicationStatus; note: string | null; createdAt: string }[];
  publicNotes: { body: string; createdAt: string }[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function TrackForm({ initialReference }: { initialReference?: string }) {
  const [referenceNumber, setReferenceNumber] = useState(initialReference ?? "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/applications/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber, email }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Something went wrong.");
      setResult(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-9"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
              Reference number
            </span>
            <input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="MPG-2026-000001"
              required
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={15} />}
          {loading ? "Looking up…" : "Track application"}
        </button>
      </form>

      {result && (
        <div className="mt-8 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-ink-500">{result.referenceNumber}</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-forest-900">{result.serviceTitle}</h2>
            </div>
            <span className={`rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${statusBadgeClass(result.status)}`}>
              {STATUS_LABELS[result.status]}
            </span>
          </div>

          <div className="mt-4 grid gap-4 text-sm text-ink-500 sm:grid-cols-2">
            <p>Submitted {formatDate(result.submittedAt)}</p>
            <p>Last updated {formatDate(result.updatedAt)}</p>
          </div>

          <p className="mt-4 rounded-stub bg-forest-700/5 p-4 text-sm text-forest-900">
            <strong>Next step:</strong> {STATUS_NEXT_STEP[result.status]}
          </p>

          {result.publicNotes.length > 0 && (
            <div className="mt-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">
                Notes from our team
              </h3>
              <ul className="mt-2 space-y-3">
                {result.publicNotes.map((note, i) => (
                  <li key={i} className="rounded-stub bg-cream-100 p-3 text-sm text-ink-700">
                    {note.body}
                    <div className="mt-1 text-xs text-ink-500">{formatDate(note.createdAt)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Timeline</h3>
            <ol className="mt-3 space-y-4 border-l border-forest-900/10 pl-5">
              {result.timeline.map((event, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.45rem] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest-700 text-cream-50">
                    {i === result.timeline.length - 1 ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                  </span>
                  <p className="text-sm font-medium text-forest-900">{STATUS_LABELS[event.status]}</p>
                  {event.note && <p className="text-sm text-ink-500">{event.note}</p>}
                  <p className="text-xs text-ink-500">{formatDate(event.createdAt)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
