"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type FieldConfig = {
  name: string;
  placeholder: string;
  type?: "text" | "textarea";
};

export function JsonListEditor({
  name,
  label,
  fields,
  defaultValue,
  emptyRow,
}: {
  name: string;
  label: string;
  fields: FieldConfig[];
  defaultValue: Record<string, string>[];
  emptyRow: Record<string, string>;
}) {
  const [rows, setRows] = useState<Record<string, string>[]>(
    defaultValue.length > 0 ? defaultValue : [emptyRow]
  );

  function updateRow(index: number, key: string, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  return (
    <div>
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {label}
      </span>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-md border border-forest-900/10 bg-cream-100 p-3"
          >
            <div className="flex-1 space-y-2">
              {fields.map((field) =>
                field.type === "textarea" ? (
                  <textarea
                    key={field.name}
                    value={row[field.name] ?? ""}
                    onChange={(e) => updateRow(i, field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    className="input resize-none"
                  />
                ) : (
                  <input
                    key={field.name}
                    value={row[field.name] ?? ""}
                    onChange={(e) => updateRow(i, field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="input"
                  />
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="mt-1 shrink-0 text-red-500 hover:text-red-700"
              aria-label="Remove row"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 hover:text-forest-900"
      >
        <Plus size={14} />
        Add row
      </button>

      <input type="hidden" name={name} value={JSON.stringify(rows)} />
    </div>
  );
}
