"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/auth";

type State = { error?: string; success?: boolean };

const initialState: State = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const action = resetPassword.bind(null, token);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div className="space-y-4">
        <p className="rounded-stub bg-forest-700/10 p-4 text-sm text-forest-700">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link
          href="/admin/login"
          className="block text-center text-sm font-semibold text-forest-700 hover:underline"
        >
          Go to sign in →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          New password
        </label>
        <input name="newPassword" type="password" required minLength={8} className="input" />
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          Confirm new password
        </label>
        <input name="confirmPassword" type="password" required minLength={8} className="input" />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Reset password"}
      </button>
    </form>
  );
}
