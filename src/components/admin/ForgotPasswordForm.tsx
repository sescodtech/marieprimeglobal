"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";

type State = { error?: string; success?: boolean };

const initialState: State = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.success) {
    return (
      <div className="space-y-4">
        <p className="rounded-stub bg-forest-700/10 p-4 text-sm text-forest-700">
          If that email matches an admin account, a password reset link is on its way. It
          expires in 1 hour.
        </p>
        <Link href="/admin/login" className="text-sm font-medium text-forest-700 hover:underline">
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="input"
          placeholder="admin@marieprimeglobal.com"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>

      <Link
        href="/admin/login"
        className="block text-center text-sm font-medium text-forest-700 hover:underline"
      >
        ← Back to sign in
      </Link>
    </form>
  );
}
