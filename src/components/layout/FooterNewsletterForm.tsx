"use client";

import { useActionState } from "react";
import { Send, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

export function FooterNewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null);

  return (
    <div>
      <form action={formAction} className="mt-4 flex items-center gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="w-full min-w-0 rounded-full border border-cream-50/15 bg-cream-50/[0.05] px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-200/40 outline-none transition-colors focus:border-gold-400"
        />
        <button
          type="submit"
          disabled={isPending}
          aria-label="Subscribe"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-forest-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
      {state && (
        <p className={`mt-2 text-xs ${state.success ? "text-gold-300" : "text-red-300"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}
