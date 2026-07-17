import type { Service } from "@prisma/client";
import { JsonListEditor } from "@/components/admin/JsonListEditor";

function asRows(value: unknown): Record<string, string>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((row): row is Record<string, string> => typeof row === "object" && row !== null);
}

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
        <Field label="Route code (e.g. MPG-VSA)">
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

      <Field label="Tagline (shown under the H1 on the detail page)">
        <input name="tagline" defaultValue={service?.tagline ?? ""} className="input" />
      </Field>

      <Field label="Overview (detail page's main description)">
        <textarea
          name="description"
          defaultValue={service?.description}
          required
          rows={4}
          className="input resize-none"
        />
      </Field>

      <JsonListEditor
        name="benefits"
        label="Benefits (shown as cards on the detail page)"
        fields={[
          { name: "title", placeholder: "Benefit title" },
          { name: "description", placeholder: "Benefit description", type: "textarea" },
        ]}
        defaultValue={asRows(service?.benefits)}
        emptyRow={{ title: "", description: "" }}
      />

      <JsonListEditor
        name="process"
        label="Process steps (how it works)"
        fields={[
          { name: "step", placeholder: "Step number, e.g. 01" },
          { name: "title", placeholder: "Step title" },
          { name: "description", placeholder: "Step description", type: "textarea" },
        ]}
        defaultValue={asRows(service?.process)}
        emptyRow={{ step: "", title: "", description: "" }}
      />

      <JsonListEditor
        name="faqs"
        label="FAQs (shown on the detail page)"
        fields={[
          { name: "question", placeholder: "Question" },
          { name: "answer", placeholder: "Answer", type: "textarea" },
        ]}
        defaultValue={asRows(service?.faqs)}
        emptyRow={{ question: "", answer: "" }}
      />

      <Field label="Image URL (optional — pick from Media Library)">
        <input name="imageUrl" defaultValue={service?.imageUrl ?? ""} className="input" />
      </Field>

      <Field label="Banner URL (optional — wide hero image, pick from Media Library)">
        <input name="bannerUrl" defaultValue={service?.bannerUrl ?? ""} className="input" />
      </Field>

      <Field label="Processing time (optional, e.g. '3–5 business days')">
        <input name="processingTime" defaultValue={service?.processingTime ?? ""} className="input" />
      </Field>

      <Field label="Requirements (one per line, shown to clients before they apply)">
        <textarea
          name="requirements"
          defaultValue={asStringList(service?.requirements).join("\n")}
          rows={4}
          className="input resize-none"
          placeholder={"Valid means of ID\nProof of address\nPassport photograph"}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Meta title (SEO, optional)">
          <input name="metaTitle" defaultValue={service?.metaTitle ?? ""} className="input" />
        </Field>
        <Field label="Meta description (SEO, optional)">
          <input name="metaDescription" defaultValue={service?.metaDescription ?? ""} className="input" />
        </Field>
      </div>

      <div className="rounded-stub bg-forest-700/5 p-4 space-y-5">
        <Field label="Application mode — how clients start with this service">
          <select name="applicationMode" defaultValue={service?.applicationMode ?? "APPLY_ONLY"} className="input">
            <option value="APPLY_ONLY">Apply only</option>
            <option value="ENQUIRY_ONLY">Enquiry only</option>
            <option value="APPLY_AND_ENQUIRY">Apply + Enquiry</option>
            <option value="HIDDEN">Hidden (neither button shown, applications not advertised)</option>
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="showApplyButton"
              defaultChecked={service?.showApplyButton ?? true}
              className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
            />
            Show Apply button
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="showEnquiryButton"
              defaultChecked={service?.showEnquiryButton ?? true}
              className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
            />
            Show Enquiry button
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Apply button redirects to">
            <select name="applyRedirect" defaultValue={service?.applyRedirect ?? "SERVICE_DETAILS"} className="input">
              <option value="SERVICE_DETAILS">Service details (default apply flow)</option>
              <option value="CONTACT">Contact page</option>
              <option value="ENQUIRY">Enquiry form (pre-filled to this service)</option>
              <option value="CUSTOM">Custom URL</option>
            </select>
          </Field>
          <Field label="Custom URL (only used when redirect is Custom URL)">
            <input name="applyRedirectUrl" defaultValue={service?.applyRedirectUrl ?? ""} className="input" placeholder="https://…" />
          </Field>
        </div>

        <Field label="Service status">
          <select name="status" defaultValue={service?.status ?? "ACTIVE"} className="input">
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="COMING_SOON">Coming soon</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
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
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isArchived"
            defaultChecked={service?.isArchived ?? false}
            className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
          />
          Archived (hidden everywhere, kept for records)
        </label>
      </div>
    </div>
  );
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
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
