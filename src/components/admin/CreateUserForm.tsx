"use client";

import { useActionState } from "react";
import { createUser } from "@/lib/actions/users";
import { ROLE_LABELS } from "@/lib/permissions";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function CreateUserForm({ availableRoles }: { availableRoles: string[] }) {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Full name">
        <input name="name" type="text" required className="input" />
      </Field>
      <Field label="Email address">
        <input name="email" type="email" required className="input" />
      </Field>
      <Field label="Temporary password (min. 8 characters)">
        <input name="password" type="password" required minLength={8} className="input" />
      </Field>
      <Field label="Role">
        <select name="role" required defaultValue={availableRoles[availableRoles.length - 1]} className="input">
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role] ?? role}
            </option>
          ))}
        </select>
      </Field>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">{label}</span>
      {children}
    </label>
  );
}
