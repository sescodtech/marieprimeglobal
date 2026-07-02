import type { Service } from "@prisma/client";

export function ServiceFormFields({ service }: { service?: Service }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input name="title" defaultValue={service?.title} required className="input" />
        </Field>
        <Field label="Slug (used in URL, lowercase-with-hyphens)">
          <input name="slug" defaultValue={service?.slug} required className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Route code (e.g. MPG 101)">
          <input name="routeCode" defaultValue={service?.routeCode} required className="input" />
        </Field>
        <Field label="Route from">
          <input name="routeFrom" defaultValue={service?.routeFrom} required className="input" />
        </Field>
        <Field label="Route to">
          <input name="routeTo" defaultValue={service?.routeTo} required className="input" />
        </Field>
      </div>

      <Field label="Summary (short card description)">
        <textarea name="summary" defaultValue={service?.summary} required rows={2} className="input resize-none" />
      </Field>

      <Field label="Full description (services page)">
        <textarea
          name="description"
          defaultValue={service?.description}
          required
          rows={4}
          className="input resize-none"
        />
      </Field>

      <Field label="Image URL (optional — pick from Media Library)">
        <input name="imageUrl" defaultValue={service?.imageUrl ?? ""} className="input" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Meta title (SEO, optional)">
          <input name="metaTitle" defaultValue={service?.metaTitle ?? ""} className="input" />
        </Field>
        <Field label="Meta description (SEO, optional)">
          <input name="metaDescription" defaultValue={service?.metaDescription ?? ""} className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display order">
          <input name="order" type="number" defaultValue={service?.order ?? 0} className="input" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={service?.isPublished ?? true}
            className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
          />
          Published (visible on the live site)
        </label>
      </div>

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
