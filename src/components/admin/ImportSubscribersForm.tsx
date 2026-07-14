"use client";

import { useActionState, useRef } from "react";
import { Upload } from "lucide-react";
import { importSubscribersCsv } from "@/lib/actions/newsletter";

type State = { error?: string; success?: string };
const initialState: State = {};

export function ImportSubscribersForm() {
  const [state, formAction, pending] = useActionState(importSubscribersCsv, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <input type="file" name="file" accept=".csv,text/csv" required className="text-sm" />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-stub border border-forest-700/25 px-4 py-2 text-xs font-semibold text-forest-700 hover:border-forest-700 disabled:opacity-60"
      >
        <Upload size={14} />
        {pending ? "Importing…" : "Import CSV"}
      </button>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
      {state.success && <span className="text-xs text-forest-700">{state.success}</span>}
    </form>
  );
}
