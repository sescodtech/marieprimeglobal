export type ServiceApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ADDITIONAL_DOCS_REQUIRED"
  | "DOCUMENTS_RECEIVED"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export const STATUS_LABELS: Record<ServiceApplicationStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ADDITIONAL_DOCS_REQUIRED: "Additional Documents Required",
  DOCUMENTS_RECEIVED: "Documents Received",
  PROCESSING: "Processing",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

export const STATUS_ORDER: ServiceApplicationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ADDITIONAL_DOCS_REQUIRED",
  "DOCUMENTS_RECEIVED",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

export const TERMINAL_STATUSES: ServiceApplicationStatus[] = ["APPROVED", "REJECTED", "COMPLETED"];

/** Plain-language "what happens next" shown on the public tracking page. */
export const STATUS_NEXT_STEP: Record<ServiceApplicationStatus, string> = {
  SUBMITTED: "Our team will begin reviewing your application shortly.",
  UNDER_REVIEW: "We're reviewing the details you submitted.",
  ADDITIONAL_DOCS_REQUIRED:
    "We need a bit more from you — please check the note below and reply to your confirmation email with the requested document(s).",
  DOCUMENTS_RECEIVED: "Thanks — we've received your additional documents and are continuing the review.",
  PROCESSING: "Your application is being processed.",
  APPROVED: "Your application has been approved. Our team will be in touch with next steps.",
  REJECTED: "Your application was not approved this time. Contact us if you have questions.",
  COMPLETED: "This application is complete. Thank you for choosing MariePrime Global.",
};

export function statusBadgeClass(status: ServiceApplicationStatus): string {
  switch (status) {
    case "APPROVED":
    case "COMPLETED":
      return "bg-forest-700/10 text-forest-700";
    case "REJECTED":
      return "bg-red-500/10 text-red-600";
    case "ADDITIONAL_DOCS_REQUIRED":
      return "bg-amber-500/10 text-amber-700";
    case "PROCESSING":
    case "DOCUMENTS_RECEIVED":
      return "bg-gold-500/15 text-gold-600";
    default:
      return "bg-ink-500/10 text-ink-500";
  }
}
