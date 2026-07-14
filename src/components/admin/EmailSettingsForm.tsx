"use client";

import { useActionState } from "react";
import { updateOwnLoginEmail, updateOwnRecoveryEmail } from "@/lib/actions/account";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function EmailSettingsForm({ currentEmail, currentRecoveryEmail }: { currentEmail: string; currentRecoveryEmail: string }) {
  const [loginState, loginAction, loginPending] = useActionState(updateOwnLoginEmail, initialState);
  const [recoveryState, recoveryAction, recoveryPending] = useActionState(updateOwnRecoveryEmail, initialState);

  return (
    <div className="space-y-6">
      <form action={loginAction} className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Login email</span>
          <input name="email" type="email" defaultValue={currentEmail} required className="input" />
        </label>
        {loginState.error && <p className="text-sm text-red-600">{loginState.error}</p>}
        {loginState.success && <p className="text-sm text-forest-700">Login email updated.</p>}
        <button
          type="submit"
          disabled={loginPending}
          className="rounded-stub bg-forest-700 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
        >
          {loginPending ? "Saving…" : "Update login email"}
        </button>
      </form>

      <form action={recoveryAction} className="space-y-3 border-t border-forest-900/10 pt-6">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
            Recovery email (optional)
          </span>
          <input name="recoveryEmail" type="email" defaultValue={currentRecoveryEmail} className="input" />
        </label>
        {recoveryState.error && <p className="text-sm text-red-600">{recoveryState.error}</p>}
        {recoveryState.success && <p className="text-sm text-forest-700">Recovery email updated.</p>}
        <button
          type="submit"
          disabled={recoveryPending}
          className="rounded-stub border border-forest-700/25 px-5 py-2 text-xs font-semibold text-forest-700 hover:border-forest-700 disabled:opacity-60"
        >
          {recoveryPending ? "Saving…" : "Update recovery email"}
        </button>
      </form>
    </div>
  );
}
