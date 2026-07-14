"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const FILE_TYPE_OPTIONS = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "application/pdf", label: "PDF" },
];

export function DocumentRequirementForm({
  action,
  defaultValues,
  submitLabel,
  onDone,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string | null;
    isRequired: boolean;
    fileTypes: string;
    maxSizeMb: number;
    order: number;
  };
  submitLabel: string;
  onDone?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const selectedTypes = (defaultValues?.fileTypes ?? "image/jpeg,image/png,application/pdf").split(",");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      router.refresh();
      onDone?.();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Document name</span>
        <input name="name" defaultValue={defaultValues?.name} required className="input" placeholder="e.g. Utility Bill" />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
          Description / help text (optional)
        </span>
        <input
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          className="input"
          placeholder="e.g. Not older than 3 months"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Max size (MB)</span>
          <input name="maxSizeMb" type="number" min={1} max={50} defaultValue={defaultValues?.maxSizeMb ?? 8} className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Display order</span>
          <input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="input" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-1.5 font-mono text-xs uppercase tracking-wider text-ink-500">Accepted file types</legend>
        <div className="flex flex-wrap gap-4">
          {FILE_TYPE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                name="fileTypes"
                value={opt.value}
                defaultChecked={selectedTypes.includes(opt.value)}
                className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          name="isRequired"
          defaultChecked={defaultValues?.isRequired ?? true}
          className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
        />
        Required
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="text-sm font-medium text-ink-500 hover:text-forest-700">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
