"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendNewsletterNow, scheduleNewsletter, deleteNewsletterDraft } from "@/lib/actions/newsletter";

export function NewsletterActions({ id }: { id: string }) {
  const [scheduling, setScheduling] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSendNow() {
    if (!confirm("Send this newsletter to all subscribed contacts now?")) return;
    startTransition(async () => {
      await sendNewsletterNow(id);
      router.refresh();
    });
  }

  function handleSchedule() {
    setError(null);
    startTransition(async () => {
      try {
        await scheduleNewsletter(id, scheduledFor);
        setScheduling(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this draft?")) return;
    startTransition(async () => {
      await deleteNewsletterDraft(id);
      router.refresh();
    });
  }

  if (scheduling) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="datetime-local"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
          className="rounded-stub border border-forest-900/15 bg-cream-100 px-3 py-1.5 text-xs"
        />
        <button
          type="button"
          disabled={isPending}
          onClick={handleSchedule}
          className="rounded-stub bg-forest-700 px-3 py-1.5 text-xs font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
        >
          Confirm
        </button>
        <button type="button" onClick={() => setScheduling(false)} className="text-xs text-ink-500 hover:text-forest-700">
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={handleSendNow}
        className="rounded-stub bg-forest-700 px-3 py-1.5 text-xs font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        Send now
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setScheduling(true)}
        className="rounded-stub border border-forest-700/25 px-3 py-1.5 text-xs font-semibold text-forest-700 hover:border-forest-700 disabled:opacity-60"
      >
        Schedule
      </button>
      <button type="button" disabled={isPending} onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700">
        Delete
      </button>
    </div>
  );
}
