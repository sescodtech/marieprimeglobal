import type { FieldConfig, FormSection } from "./types";

/**
 * Every service except Proof of Funds (which collects identity details in
 * its own dedicated "Applicant Information" section) shares this same
 * "Your Details" section, so the admin dashboard always has a name/email/
 * phone to show and the public tracking page always has something to match
 * against — without every config re-declaring the same three fields.
 */
export function contactSection(): FormSection {
  return {
    id: "contact",
    title: "Your Details",
    description: "So we know who's applying and how to reach you.",
    fields: [
      { id: "fullName", label: "Full name", type: "text", required: true },
      { id: "email", label: "Email address", type: "email", required: true },
      { id: "phone", label: "Phone number", type: "tel", required: true },
    ] satisfies FieldConfig[],
  };
}
