"use client";

import { useActionState } from "react";
import { updateUser } from "@/lib/actions/users";
import { ROLE_LABELS } from "@/lib/permissions";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function EditUserForm({
  userId,
  defaultName,
  defaultEmail,
  defaultRole,
  availableRoles,
  canEditRole,
}: {
  userId: string;
  defaultName: string;
  defaultEmail: string;
  defaultRole: string;
  availableRoles: string[];
  canEditRole: boolean;
}) {
  const action = updateUser.bind(null, userId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Full name">
        <input name="name" type="text" required defaultValue={defaultName} className="input" />
      </Field>
      <Field label="Email address">
        <input name="email" type="email" required defaultValue={defaultEmail} className="input" />
      </Field>
      <Field label="Role">
        {/* A disabled <select> is excluded from FormData on submit, so when
            role editing isn't allowed it's rendered without a `name` and the
            unchanged value is submitted via a hidden input instead. */}
        <select
          name={canEditRole ? "role" : undefined}
          defaultValue={defaultRole}
          disabled={!canEditRole}
          className="input disabled:cursor-not-allowed disabled:opacity-60"
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role] ?? role}
            </option>
          ))}
        </select>
        {!canEditRole && (
          <>
            <input type="hidden" name="role" value={defaultRole} />
            <span className="mt-1.5 block text-xs text-ink-500">You can't change your own role.</span>
          </>
        )}
      </Field>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
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
