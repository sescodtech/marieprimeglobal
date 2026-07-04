"use client";

import { useActionState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

export function NewsletterSignup() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null);

  return (
    <div className="rounded-stub border border-forest-900/10 bg-cream-100 p-6 sm:p-7">
      <div className="flex items-center gap-2.5">
        <Mail size={18} className="text-forest-700" />
        <h3 className="font-display text-base font-semibold text-forest-900">
          Get new posts by email
        </h3>
      </div>
      <p className="mt-1.5 text-sm text-ink-500">
        Occasional notes on visas, travel and study abroad. No spam.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          Subscribe
        </button>
      </form>

      {state && (
        <p className={`mt-2.5 text-xs ${state.success ? "text-forest-700" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}
