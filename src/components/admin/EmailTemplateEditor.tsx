"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEmailTemplate, resetEmailTemplateToDefault } from "@/lib/actions/emailTemplates";
import { EMAIL_TEMPLATE_VARIABLES } from "@/lib/emailTemplates";

type State = { error?: string; success?: boolean };
const initialState: State = {};

export function EmailTemplateEditor({
  templateKey,
  defaultSubject,
  defaultBodyHtml,
}: {
  templateKey: string;
  defaultSubject: string;
  defaultBodyHtml: string;
}) {
  const action = updateEmailTemplate.bind(null, templateKey);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [isResetting, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div>
      <div className="mb-5 rounded-stub bg-forest-700/5 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-500">Available variables</p>
        <p className="mt-1.5 text-sm text-forest-900">{EMAIL_TEMPLATE_VARIABLES.join("  ")}</p>
      </div>

      <form key={defaultBodyHtml} action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Subject</span>
          <input name="subject" defaultValue={defaultSubject} required className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
            Body (HTML)
          </span>
          <textarea name="bodyHtml" defaultValue={defaultBodyHtml} required rows={16} className="input resize-y font-mono text-xs" />
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.success && <p className="text-sm text-forest-700">Saved.</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save template"}
          </button>
          <button
            type="button"
            disabled={isResetting}
            onClick={() =>
              startTransition(async () => {
                await resetEmailTemplateToDefault(templateKey);
                router.refresh();
              })
            }
            className="text-sm font-medium text-ink-500 hover:text-forest-700 disabled:opacity-60"
          >
            {isResetting ? "Resetting…" : "Reset to default"}
          </button>
        </div>
      </form>
    </div>
  );
}
