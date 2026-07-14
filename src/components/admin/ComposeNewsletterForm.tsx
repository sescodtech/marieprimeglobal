"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createNewsletterDraft } from "@/lib/actions/newsletter";

type State = { error?: string; id?: string };
const initialState: State = {};

export function ComposeNewsletterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(async (prev: State, formData: FormData) => {
    const result = await createNewsletterDraft(prev, formData);
    if (result?.id) router.refresh();
    return result as State;
  }, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Subject</span>
        <input name="subject" required className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Message (HTML)</span>
        <textarea name="message" required rows={8} className="input resize-y font-mono text-xs" />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.id && <p className="text-sm text-forest-700">Draft saved below.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}
