import type { JobListing } from "@prisma/client";

export function JobListingFormFields({ job }: { job?: JobListing }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input name="title" defaultValue={job?.title} required className="input" />
        </Field>
        <Field label="Slug (used as an anchor on the Careers page)">
          <input name="slug" defaultValue={job?.slug} required className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Department">
          <input name="department" defaultValue={job?.department} required className="input" />
        </Field>
        <Field label="Location">
          <input name="location" defaultValue={job?.location} required className="input" />
        </Field>
        <Field label="Type (e.g. Full-time)">
          <input name="type" defaultValue={job?.type} required className="input" />
        </Field>
      </div>

      <Field label="Summary">
        <textarea name="summary" defaultValue={job?.summary} required rows={3} className="input resize-none" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display order">
          <input name="order" type="number" defaultValue={job?.order ?? 0} className="input" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={job?.isPublished ?? true}
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
