"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/actions/account";

type State = { error?: string; success?: boolean };

const initialState: State = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  if (state.success) {
    return (
      <p className="rounded-stub bg-forest-700/10 p-4 text-sm text-forest-700">
        Password updated. Use it next time you sign in.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Current password">
        <input name="currentPassword" type="password" required className="input" />
      </Field>
      <Field label="New password (min. 8 characters)">
        <input name="newPassword" type="password" required minLength={8} className="input" />
      </Field>
      <Field label="Confirm new password">
        <input name="confirmPassword" type="password" required minLength={8} className="input" />
      </Field>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}
