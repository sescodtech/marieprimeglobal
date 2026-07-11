"use client";

import { useActionState } from "react";
import { addEnquiryNote } from "@/lib/actions/enquiries";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function AddEnquiryNoteForm({ enquiryId }: { enquiryId: string }) {
  const action = addEnquiryNote.bind(null, enquiryId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <textarea name="body" rows={3} required placeholder="Add an internal note…" className="input resize-none" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-forest-700">Note added.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add note"}
      </button>
    </form>
  );
}
