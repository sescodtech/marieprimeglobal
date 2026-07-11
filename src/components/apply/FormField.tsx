"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { FieldConfig } from "@/lib/applicationForms/types";

export function FormField({
  field,
  register,
  errors,
}: {
  field: FieldConfig;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
}) {
  const error = errors[field.id]?.message as string | undefined;

  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </span>

      {field.type === "textarea" ? (
        <textarea {...register(field.id)} rows={3} placeholder={field.placeholder} className="input resize-none" />
      ) : field.type === "select" ? (
        <select {...register(field.id)} className="input" defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...register(field.id)}
          type={field.type === "number" ? "number" : field.type}
          placeholder={field.placeholder}
          className="input"
        />
      )}

      {field.helpText && !error && <span className="mt-1 block text-xs text-ink-500">{field.helpText}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
