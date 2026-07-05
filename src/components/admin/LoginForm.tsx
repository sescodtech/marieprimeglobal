"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { ForgotPasswordLink } from "@/components/admin/ForgotPasswordLink";

type State = { error?: string };

const initialState: State = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="input"
          placeholder="admin@marieprimeglobal.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          Password
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="input pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-forest-700"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {state.error && (
        <p className="rounded-stub bg-red-50 p-3 text-sm text-red-600">{state.error}</p>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-ink-500">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-forest-900/25 text-forest-700 focus:ring-gold-500"
          />
          Remember me
        </label>
        <ForgotPasswordLink />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
