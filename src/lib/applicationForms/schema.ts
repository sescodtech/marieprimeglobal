import { z } from "zod";
import type { FieldConfig, FormSection } from "./types";

function fieldToZod(field: FieldConfig) {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "email":
      schema = z.string().email(`Enter a valid email for "${field.label}".`);
      break;
    case "number":
      schema = z
        .string()
        .min(1, `${field.label} is required.`)
        .refine((v) => !Number.isNaN(Number(v)), `${field.label} must be a number.`);
      break;
    case "select":
      schema = z.string();
      break;
    default:
      schema = z.string();
  }

  if (field.type !== "number" && field.type !== "email") {
    const minLength = field.minLength ?? (field.required ? 1 : 0);
    if (minLength > 0) {
      schema = (schema as z.ZodString).min(
        minLength,
        field.required ? `${field.label} is required.` : `${field.label} must be at least ${minLength} characters.`
      );
    }
  }

  if (!field.required) {
    schema = schema.or(z.literal("")).optional();
  }

  return schema;
}

/** Builds one flat Zod object schema covering every field across every
 *  section of a service — used to validate the whole application on submit. */
export function buildApplicationSchema(sections: FormSection[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const section of sections) {
    for (const field of section.fields) {
      shape[field.id] = fieldToZod(field);
    }
  }
  return z.object(shape);
}

/** Field ids belonging to one section — used by the wizard to validate only
 *  the current step before allowing "Next". */
export function fieldIdsForSection(section: FormSection): string[] {
  return section.fields.map((f) => f.id);
}
