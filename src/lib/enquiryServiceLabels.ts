export const ENQUIRY_SERVICE_LABELS: Record<string, string> = {
  FLIGHT_BOOKING: "Flight Booking & Travel Solutions",
  VISA_IMMIGRATION: "Visa & Immigration Assistance",
  TRAVEL_LOAN: "Travel Loan Assistance",
  STUDY_ABROAD: "Study Abroad Support",
  BUSINESS_REGISTRATION: "Business Registration Services",
  HOTEL_RESERVATION: "Hotel Reservations",
  TRAVEL_INSURANCE: "Travel Insurance",
  LOGISTICS: "Logistics",
  PROCUREMENT: "Procurement & General Merchandise",
  EVENT_COORDINATION: "Event Coordination",
  BEAUTY_SERVICES: "Beauty Services",
  GENERAL_ENQUIRY: "General Enquiry",
};

export const ENQUIRY_SERVICE_OPTIONS = Object.entries(ENQUIRY_SERVICE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// Maps a Service CMS slug (e.g. from ?service=visa-travel-assistance) to the
// matching enquiry category, so arriving from a service or apply page
// auto-selects the right option instead of always defaulting to General.
export const SLUG_TO_SERVICE_INTEREST: Record<string, string> = {
  "visa-travel-assistance": "VISA_IMMIGRATION",
  "flight-booking": "FLIGHT_BOOKING",
  "hotel-reservations": "HOTEL_RESERVATION",
  "travel-insurance": "TRAVEL_INSURANCE",
  logistics: "LOGISTICS",
  "procurement-merchandise": "PROCUREMENT",
  "event-coordination": "EVENT_COORDINATION",
  "beauty-services": "BEAUTY_SERVICES",
  "proof-of-funds": "GENERAL_ENQUIRY", // POF has no direct enquiry category — General is the honest fallback
};
