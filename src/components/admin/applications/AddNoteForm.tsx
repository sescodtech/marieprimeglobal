"use client";

import { useActionState } from "react";
import { addApplicationNote } from "@/lib/actions/applications";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function AddNoteForm({ applicationId }: { applicationId: string }) {
  const action = addApplicationNote.bind(null, applicationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <textarea name="body" rows={3} required placeholder="Add a note…" className="input resize-none" />
      <label className="flex items-center gap-2 text-sm text-ink-500">
        <input type="checkbox" name="isPublic" className="h-4 w-4 rounded border-forest-700/40 text-forest-700" />
        Visible to the client on their tracking page
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-forest-700">Note added.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add note"}
      </button>
    </form>
  );
}
