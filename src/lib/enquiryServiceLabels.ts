export const ENQUIRY_SERVICE_LABELS: Record<string, string> = {
  STUDY_ABROAD: "Study Abroad Support",
  VISA_IMMIGRATION: "Visa & Immigration Assistance",
  TRAVEL_PACKAGES: "Travel Packages",
  FLIGHT_BOOKING: "Flight Booking & Travel Solutions",
  HOTEL_RESERVATION: "Hotel Reservations",
  TRAVEL_INSURANCE: "Travel Insurance",
  SCHOLARSHIP_ASSISTANCE: "Scholarship Assistance",
  TRAVEL_LOAN: "Travel Loan Assistance",
  EDUCATION_LOAN: "Education Loan Assistance",
  CORPORATE_TRAVEL: "Corporate Travel",
  BUSINESS_REGISTRATION: "Business Registration Services",
  GENERAL_ENQUIRY: "General Enquiry",
};

export const ENQUIRY_SERVICE_OPTIONS = Object.entries(ENQUIRY_SERVICE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// Maps a Service CMS slug (e.g. from ?service=visa-assistance) to the
// matching enquiry category, so arriving from a service or apply page
// auto-selects the right option instead of always defaulting to General.
// Keys here must match the real seeded slugs in servicePages.ts.
export const SLUG_TO_SERVICE_INTEREST: Record<string, string> = {
  "study-abroad": "STUDY_ABROAD",
  "visa-assistance": "VISA_IMMIGRATION",
  "travel-packages": "TRAVEL_PACKAGES",
  "flight-reservations": "FLIGHT_BOOKING",
  "hotel-bookings": "HOTEL_RESERVATION",
  "travel-insurance": "TRAVEL_INSURANCE",
  "scholarship-assistance": "SCHOLARSHIP_ASSISTANCE",
  "travel-loans": "TRAVEL_LOAN",
  "education-loans": "EDUCATION_LOAN",
  "corporate-travel": "CORPORATE_TRAVEL",
  "business-registration": "BUSINESS_REGISTRATION",
  "proof-of-funds": "GENERAL_ENQUIRY", // POF has no direct enquiry category — General is the honest fallback
};
