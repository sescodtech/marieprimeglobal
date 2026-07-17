"use client";

const POPUP_TYPES = [
  { value: "PROMOTION", label: "Promotion" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "TRAVEL_UPDATE", label: "Travel Update" },
  { value: "VISA_UPDATE", label: "Visa Update" },
  { value: "HOLIDAY_NOTICE", label: "Holiday Notice" },
  { value: "INFORMATION", label: "Information" },
  { value: "GENERAL_ANNOUNCEMENT", label: "General Announcement" },
];

const DISPLAY_RULES = [
  { value: "ENTIRE_WEBSITE", label: "Entire website" },
  { value: "HOMEPAGE_ONLY", label: "Homepage only" },
  { value: "SPECIFIC_PAGE", label: "Specific page (enter path below)" },
  { value: "SPECIFIC_SERVICE", label: "Specific service (enter slug below)" },
  { value: "SPECIFIC_BLOG", label: "Specific blog post (enter slug below)" },
];

const TRIGGER_RULES = [
  { value: "AFTER_SECONDS", label: "After X seconds" },
  { value: "AFTER_SCROLL_PERCENT", label: "After scroll %" },
  { value: "EXIT_INTENT", label: "Exit intent" },
  { value: "FIRST_VISIT", label: "First visit only" },
  { value: "ONCE_PER_SESSION", label: "Once per session" },
  { value: "ALWAYS", label: "Always" },
];

export type PopupFormValues = {
  title: string;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string | null;
  bgColor: string;
  textColor: string;
  isEnabled: boolean;
  startDate: Date | null;
  endDate: Date | null;
  popupType: string;
  displayRule: string;
  displayTarget: string | null;
  triggerRule: string;
  triggerValue: number;
  order: number;
};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function PopupFormFields({ popup }: { popup?: PopupFormValues }) {
  return (
    <div className="space-y-5">
      <Field label="Title">
        <input name="title" defaultValue={popup?.title} required className="input" />
      </Field>
      <Field label="Subtitle (optional)">
        <input name="subtitle" defaultValue={popup?.subtitle ?? ""} className="input" />
      </Field>
      <Field label="Description (optional)">
        <textarea name="description" defaultValue={popup?.description ?? ""} rows={3} className="input resize-none" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Button text (optional)">
          <input name="buttonText" defaultValue={popup?.buttonText ?? ""} className="input" />
        </Field>
        <Field label="Button link (optional)">
          <input name="buttonLink" defaultValue={popup?.buttonLink ?? ""} className="input" placeholder="/apply/visa-travel-assistance" />
        </Field>
      </div>

      <Field label="Image URL (optional — pick from Media Library)">
        <input name="imageUrl" defaultValue={popup?.imageUrl ?? ""} className="input" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Background color">
          <input name="bgColor" type="text" defaultValue={popup?.bgColor ?? "#0B0F1A"} className="input" />
        </Field>
        <Field label="Text color">
          <input name="textColor" type="text" defaultValue={popup?.textColor ?? "#FFFFFF"} className="input" />
        </Field>
      </div>

      <Field label="Popup type">
        <select name="popupType" defaultValue={popup?.popupType ?? "GENERAL_ANNOUNCEMENT"} className="input">
          {POPUP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display rule">
          <select name="displayRule" defaultValue={popup?.displayRule ?? "ENTIRE_WEBSITE"} className="input">
            {DISPLAY_RULES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Display target (page path or slug, if applicable)">
          <input name="displayTarget" defaultValue={popup?.displayTarget ?? ""} className="input" placeholder="visa-travel-assistance" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Trigger rule">
          <select name="triggerRule" defaultValue={popup?.triggerRule ?? "AFTER_SECONDS"} className="input">
            {TRIGGER_RULES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Trigger value (seconds or scroll %, if applicable)">
          <input name="triggerValue" type="number" min={0} defaultValue={popup?.triggerValue ?? 5} className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start date (optional)">
          <input name="startDate" type="date" defaultValue={toDateInputValue(popup?.startDate ?? null)} className="input" />
        </Field>
        <Field label="End date (optional)">
          <input name="endDate" type="date" defaultValue={toDateInputValue(popup?.endDate ?? null)} className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display order">
          <input name="order" type="number" defaultValue={popup?.order ?? 0} className="input" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input type="checkbox" name="isEnabled" defaultChecked={popup?.isEnabled ?? true} className="h-4 w-4 rounded border-forest-900/30 text-forest-700" />
          Enabled
        </label>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">{label}</span>
      {children}
    </label>
  );
}
