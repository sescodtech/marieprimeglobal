import type { Testimonial } from "@prisma/client";

export function TestimonialFormFields({ testimonial }: { testimonial?: Testimonial }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Client name">
          <input name="clientName" defaultValue={testimonial?.clientName} required className="input" />
        </Field>
        <Field label="Client role / context">
          <input
            name="clientRole"
            defaultValue={testimonial?.clientRole ?? ""}
            placeholder="e.g. Study Abroad Client"
            className="input"
          />
        </Field>
      </div>

      <Field label="Quote">
        <textarea name="quote" defaultValue={testimonial?.quote} required rows={4} className="input resize-none" />
      </Field>

      <Field label="Photo URL (optional — pick from Media Library)">
        <input name="photoUrl" defaultValue={testimonial?.photoUrl ?? ""} className="input" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Rating (1–5)">
          <input
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={testimonial?.rating ?? 5}
            className="input"
          />
        </Field>
        <Field label="Display order">
          <input name="order" type="number" defaultValue={testimonial?.order ?? 0} className="input" />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={testimonial?.isPublished ?? true}
          className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
        />
        Published (visible on the live site)
      </label>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 4px;
          border: 1px solid rgba(15, 42, 32, 0.15);
          background: #fbf9f5;
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: #16211c;
        }
        .input:focus {
          outline: none;
          border-color: #c9a876;
        }
      `}</style>
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
