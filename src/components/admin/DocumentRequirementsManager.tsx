"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DocumentRequirementForm } from "@/components/admin/DocumentRequirementForm";

export type DocRequirementRow = {
  id: string;
  name: string;
  description: string | null;
  isRequired: boolean;
  fileTypes: string;
  maxSizeMb: number;
  order: number;
};

const FILE_TYPE_LABELS: Record<string, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "application/pdf": "PDF",
};

export function DocumentRequirementsManager({
  rows,
  isConfigured,
  createAction,
  updateAction,
  deleteAction,
  seedAction,
}: {
  rows: DocRequirementRow[];
  isConfigured: boolean;
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (id: string, formData: FormData) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  seedAction: () => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div>
      {!isConfigured && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-stub bg-gold-500/10 p-4">
          <p className="text-sm text-forest-900">
            This service is currently using the built-in default documents. Load them here to customize.
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => { await seedAction(); router.refresh(); })}
            className="shrink-0 rounded-stub bg-forest-700 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
          >
            Load defaults to customize
          </button>
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row) =>
          editingId === row.id ? (
            <div key={row.id} className="rounded-stub bg-cream-100 p-5">
              <DocumentRequirementForm
                submitLabel="Save changes"
                defaultValues={row}
                action={(formData) => updateAction(row.id, formData)}
                onDone={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div key={row.id} className="flex items-center justify-between gap-4 rounded-stub bg-cream-100 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-forest-900">{row.name}</span>
                  {row.isRequired ? (
                    <span className="rounded-full bg-forest-700/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-forest-700">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-500">
                      Optional
                    </span>
                  )}
                </div>
                {row.description && <p className="mt-0.5 text-xs text-ink-500">{row.description}</p>}
                <p className="mt-1 text-xs text-ink-500">
                  {row.fileTypes
                    .split(",")
                    .map((t) => FILE_TYPE_LABELS[t] ?? t)
                    .join(", ")}{" "}
                  · up to {row.maxSizeMb}MB
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button type="button" onClick={() => setEditingId(row.id)} className="text-forest-700 hover:text-forest-900" title="Edit">
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(async () => { await deleteAction(row.id); router.refresh(); })}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        )}

        {rows.length === 0 && !isConfigured && (
          <p className="text-sm text-ink-500">Load the defaults above, then edit or remove them here.</p>
        )}
      </div>

      <div className="mt-6">
        {adding ? (
          <div className="rounded-stub bg-cream-100 p-5">
            <DocumentRequirementForm submitLabel="Add document" action={createAction} onDone={() => setAdding(false)} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-stub border border-forest-700/25 px-5 py-2.5 text-sm font-semibold text-forest-700 hover:border-forest-700"
          >
            <Plus size={15} />
            Add document
          </button>
        )}
      </div>
    </div>
  );
}
