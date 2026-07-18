// Shared types for the Phase 2 dynamic application form system. Every
// service's form is described declaratively here (see config.ts) instead of
// being hand-coded — that's what makes the wizard, validation, review step,
// and admin display all work generically off one definition per service.

// Matches the 11 real services seeded from servicePages.ts, plus
// PROOF_OF_FUNDS which is a standalone add-on with no CMS service page of
// its own. LOGISTICS/PROCUREMENT/EVENT_COORDINATION/BEAUTY_SERVICES were
// leftover boilerplate from a different template and are no longer part of
// this union — nothing on the real site offers those services.
export type ServiceApplicationType =
  | "STUDY_ABROAD"
  | "VISA"
  | "TRAVEL_PACKAGES"
  | "FLIGHT_BOOKING"
  | "HOTEL_RESERVATION"
  | "TRAVEL_INSURANCE"
  | "SCHOLARSHIP_ASSISTANCE"
  | "TRAVEL_LOANS"
  | "EDUCATION_LOANS"
  | "CORPORATE_TRAVEL"
  | "BUSINESS_REGISTRATION"
  | "PROOF_OF_FUNDS";

export type FieldType = "text" | "email" | "tel" | "date" | "textarea" | "select" | "number";

export type FieldOption = { value: string; label: string };

export type FieldConfig = {
  id: string; // key inside the submitted formData JSON — must be unique across ALL sections in a service
  label: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[]; // required when type === "select"
  placeholder?: string;
  helpText?: string;
  minLength?: number;
};

export type FormSection = {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
};

export type DocumentFieldConfig = {
  id: string; // docType stored on ApplicationDocument
  label: string;
  required?: boolean;
  accept: string; // input `accept` attribute
  helpText?: string;
  maxSizeBytes?: number; // defaults to 8MB if omitted — see MAX_UPLOAD_BYTES_DEFAULT
};

export type ApplicantContact = { name: string; email: string; phone: string };

export type ServiceApplicationConfig = {
  type: ServiceApplicationType;
  /** Matches an existing CMS Service slug so the "read information" step can
   *  pull real marketing copy. Null when there's no matching CMS page (POF). */
  cmsSlug: string | null;
  title: string;
  summary: string;
  sections: FormSection[];
  documents: DocumentFieldConfig[];
  /** Derives the top-level applicantName/Email/Phone columns from whatever
   *  field ids this service actually collects them under. */
  extractContact: (values: Record<string, string>) => ApplicantContact;
};
