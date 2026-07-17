export const APPLICATION_MODE_LABELS: Record<string, string> = {
  APPLY_ONLY: "Apply Only",
  ENQUIRY_ONLY: "Enquiry Only",
  APPLY_AND_ENQUIRY: "Apply + Enquiry",
  HIDDEN: "Hidden",
};

export const SERVICE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  CLOSED: "Closed",
  MAINTENANCE: "Maintenance",
  COMING_SOON: "Coming Soon",
};

export const APPLY_REDIRECT_LABELS: Record<string, string> = {
  CONTACT: "Contact page",
  ENQUIRY: "Enquiry form",
  SERVICE_DETAILS: "Service details",
  CUSTOM: "Custom URL",
};

type ServiceControlFields = {
  applicationMode: string;
  status: string;
  showApplyButton: boolean;
  showEnquiryButton: boolean;
  applyRedirect: string;
  applyRedirectUrl: string | null;
};

/**
 * The single source of truth for whether a service's Apply/Enquiry buttons
 * should actually render, and where "Apply" should point. Never returns a
 * "this isn't available" message — per spec, a hidden application is simply
 * absent, not explained.
 */
export function getServiceControlState(
  service: ServiceControlFields,
  slug: string,
  globalControls: { applicationsEnabled: boolean; enquiriesEnabled: boolean } = {
    applicationsEnabled: true,
    enquiriesEnabled: true,
  }
): { showApply: boolean; showEnquiry: boolean; applyHref: string | null } {
  // A service under maintenance or coming soon never shows either button —
  // there's nothing to apply or enquire about yet.
  if (service.status === "MAINTENANCE" || service.status === "COMING_SOON") {
    return { showApply: false, showEnquiry: false, applyHref: null };
  }

  const modeAllowsApply = service.applicationMode === "APPLY_ONLY" || service.applicationMode === "APPLY_AND_ENQUIRY";
  const modeAllowsEnquiry = service.applicationMode === "ENQUIRY_ONLY" || service.applicationMode === "APPLY_AND_ENQUIRY";

  // CLOSED keeps the service visible/informational but stops new
  // applications; enquiries can still come through if the mode allows it.
  const showApply =
    globalControls.applicationsEnabled && service.status !== "CLOSED" && modeAllowsApply && service.showApplyButton;
  const showEnquiry = globalControls.enquiriesEnabled && modeAllowsEnquiry && service.showEnquiryButton;

  let applyHref: string | null = null;
  if (showApply) {
    switch (service.applyRedirect) {
      case "CONTACT":
        applyHref = "/contact";
        break;
      case "ENQUIRY":
        applyHref = `/contact?service=${slug}`;
        break;
      case "CUSTOM":
        applyHref = service.applyRedirectUrl || null;
        break;
      case "SERVICE_DETAILS":
      default:
        applyHref = `/apply/${slug}`;
    }
  }

  return { showApply, showEnquiry, applyHref: showApply ? applyHref : null };
}
