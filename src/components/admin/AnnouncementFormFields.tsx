"use client";

export type AnnouncementFormValues = {
  title: string;
  message: string;
  icon: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  bgColor: string;
  textColor: string;
  priority: number;
  isEnabled: boolean;
  startDate: Date | null;
  endDate: Date | null;
  displayRule: string;
  selectedPages: unknown;
};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function toSelectedPagesText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.join("\n");
}

export function AnnouncementFormFields({ announcement }: { announcement?: AnnouncementFormValues }) {
  return (
    <div className="space-y-5">
      <Field label="Title">
        <input name="title" defaultValue={announcement?.title} required className="input" />
      </Field>
      <Field label="Message">
        <textarea name="message" defaultValue={announcement?.message} required rows={2} className="input resize-none" />
      </Field>
      <Field label="Icon (optional — a short label or emoji)">
        <input name="icon" defaultValue={announcement?.icon ?? ""} className="input" placeholder="✈️" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Button text (optional)">
          <input name="buttonText" defaultValue={announcement?.buttonText ?? ""} className="input" />
        </Field>
        <Field label="Button link (optional)">
          <input name="buttonLink" defaultValue={announcement?.buttonLink ?? ""} className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Background color">
          <input name="bgColor" defaultValue={announcement?.bgColor ?? "#1B4332"} className="input" />
        </Field>
        <Field label="Text color">
          <input name="textColor" defaultValue={announcement?.textColor ?? "#FFFFFF"} className="input" />
        </Field>
      </div>

      <Field label="Display rule">
        <select name="displayRule" defaultValue={announcement?.displayRule ?? "ENTIRE_WEBSITE"} className="input">
          <option value="ENTIRE_WEBSITE">Entire website</option>
          <option value="HOMEPAGE">Homepage only</option>
          <option value="SELECTED_PAGES">Selected pages</option>
        </select>
      </Field>
      <Field label="Selected pages (one path per line, only used when Display rule = Selected pages)">
        <textarea
          name="selectedPages"
          defaultValue={toSelectedPagesText(announcement?.selectedPages)}
          rows={3}
          className="input resize-none font-mono text-xs"
          placeholder={"/services/visa-travel-assistance\n/contact"}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start date (optional)">
          <input name="startDate" type="date" defaultValue={toDateInputValue(announcement?.startDate ?? null)} className="input" />
        </Field>
        <Field label="End date (optional)">
          <input name="endDate" type="date" defaultValue={toDateInputValue(announcement?.endDate ?? null)} className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Priority (higher shows first when rotating)">
          <input name="priority" type="number" defaultValue={announcement?.priority ?? 0} className="input" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input type="checkbox" name="isEnabled" defaultChecked={announcement?.isEnabled ?? true} className="h-4 w-4 rounded border-forest-900/30 text-forest-700" />
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
