import type { Faq } from "@prisma/client";

export function FaqFormFields({ faq }: { faq?: Faq }) {
  return (
    <div className="space-y-5">
      <Field label="Category (groups questions on the FAQ page)">
        <input name="category" defaultValue={faq?.category} required className="input" list="faq-categories" />
        <datalist id="faq-categories">
          <option value="General" />
          <option value="Visa & Immigration" />
          <option value="Study Abroad" />
          <option value="Travel & Payments" />
        </datalist>
      </Field>

      <Field label="Question">
        <input name="question" defaultValue={faq?.question} required className="input" />
      </Field>

      <Field label="Answer">
        <textarea name="answer" defaultValue={faq?.answer} required rows={4} className="input resize-none" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display order">
          <input name="order" type="number" defaultValue={faq?.order ?? 0} className="input" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={faq?.isPublished ?? true}
            className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
          />
          Published (visible on the live site)
        </label>
      </div>
    </div>
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
