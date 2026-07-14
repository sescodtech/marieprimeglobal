"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/account";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function ProfileForm({ defaultName, defaultPhone }: { defaultName: string; defaultPhone: string }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Full name</span>
        <input name="name" defaultValue={defaultName} required className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Phone number</span>
        <input name="phone" type="tel" defaultValue={defaultPhone} className="input" />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-forest-700">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
