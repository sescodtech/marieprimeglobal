// Shared types for the Phase 2 dynamic application form system. Every
// service's form is described declaratively here (see config.ts) instead of
// being hand-coded — that's what makes the wizard, validation, review step,
// and admin display all work generically off one definition per service.

export type ServiceApplicationType =
  | "VISA"
  | "PROOF_OF_FUNDS"
  | "FLIGHT_BOOKING"
  | "HOTEL_RESERVATION"
  | "TRAVEL_INSURANCE"
  | "LOGISTICS"
  | "PROCUREMENT"
  | "EVENT_COORDINATION"
  | "BEAUTY_SERVICES";

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
