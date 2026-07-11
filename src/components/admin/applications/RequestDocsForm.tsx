"use client";

import { useActionState } from "react";
import { requestAdditionalDocuments } from "@/lib/actions/applications";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function RequestDocsForm({ applicationId }: { applicationId: string }) {
  const action = requestAdditionalDocuments.bind(null, applicationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <textarea
        name="note"
        rows={2}
        required
        placeholder="e.g. Please re-upload a clearer copy of your utility bill."
        className="input resize-none"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-forest-700">Request sent.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-stub border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-500/20 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request additional documents"}
      </button>
    </form>
  );
}
