"use client";

import { useActionState } from "react";
import { updateApplicationStatus } from "@/lib/actions/applications";
import { STATUS_LABELS, TERMINAL_STATUSES, type ServiceApplicationStatus } from "@/lib/applicationForms/status";

const ALL_STATUSES = Object.keys(STATUS_LABELS) as ServiceApplicationStatus[];

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function StatusUpdateForm({
  applicationId,
  currentStatus,
  canSetTerminal,
}: {
  applicationId: string;
  currentStatus: ServiceApplicationStatus;
  canSetTerminal: boolean;
}) {
  const action = updateApplicationStatus.bind(null, applicationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const options = canSetTerminal
    ? ALL_STATUSES
    : ALL_STATUSES.filter((s) => !(TERMINAL_STATUSES as string[]).includes(s));

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Status</span>
        <select name="status" defaultValue={currentStatus} className="input">
          {options.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          Note to include (optional)
        </span>
        <textarea name="note" rows={2} className="input resize-none" placeholder="Shown to the client on their tracking page." />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-forest-700">Status updated.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update status"}
      </button>
    </form>
  );
}
