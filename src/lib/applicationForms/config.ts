import type { ServiceApplicationConfig, ServiceApplicationType } from "./types";
import { contactSection } from "./contactSection";
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NEXT_OF_KIN_RELATIONSHIP_OPTIONS,
  NIGERIAN_STATE_OPTIONS,
  CABIN_CLASS_OPTIONS,
  ROOM_PREFERENCE_OPTIONS,
  TRAVEL_INSURANCE_COVERAGE_OPTIONS,
} from "./options";

const GENERAL_DOCUMENTS = [
  {
    id: "validId",
    label: "Valid means of identification",
    required: true,
    accept: "image/jpeg,image/png,application/pdf",
    helpText: "National ID, international passport, driver's licence or voter's card.",
  },
  {
    id: "supportingDocument",
    label: "Supporting document (optional)",
    required: false,
    accept: "image/jpeg,image/png,application/pdf",
    helpText: "Anything else that helps us process your request faster.",
  },
];

export const SERVICE_APPLICATION_CONFIGS: Record<ServiceApplicationType, ServiceApplicationConfig> = {
  VISA: {
    type: "VISA",
    cmsSlug: "visa-travel-assistance",
    title: "Visa Application & Travel Assistance",
    summary: "Professional visa processing and complete travel documentation support.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "visaDetails",
        title: "Visa & Travel Details",
        fields: [
          { id: "passportNumber", label: "Passport number", type: "text", required: true },
          { id: "passportExpiryDate", label: "Passport expiry date", type: "date", required: true },
          { id: "destinationCountry", label: "Destination country", type: "text", required: true },
          { id: "travelPurpose", label: "Purpose of travel", type: "text", required: true, placeholder: "e.g. Tourism, business, study" },
          { id: "travelDate", label: "Intended travel date", type: "date", required: true },
          {
            id: "previousVisaHistory",
            label: "Previous visa history",
            type: "textarea",
            required: false,
            helpText: "Any prior visa approvals, refusals, or overstays — country and year, if any.",
          },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  PROOF_OF_FUNDS: {
    type: "PROOF_OF_FUNDS",
    cmsSlug: null,
    title: "Proof of Funds (POF)",
    summary: "Verifiable proof-of-funds documentation to support your visa, travel or institutional requirements.",
    documents: [
      { id: "validId", label: "Valid means of identification", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "utilityBill", label: "Utility bill (not older than 3 months)", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "passportPhoto", label: "Passport photograph", required: true, accept: "image/jpeg,image/png" },
      { id: "signature", label: "Signature", required: true, accept: "image/jpeg,image/png" },
    ],
    sections: [
      {
        id: "pofInfo",
        title: "POF Information",
        fields: [
          { id: "narration", label: "Narration", type: "textarea", required: true, placeholder: "What is this proof of funds for?" },
          { id: "tenor", label: "Tenor", type: "text", required: true, placeholder: "e.g. 3 months" },
          { id: "amountNeeded", label: "Amount needed", type: "number", required: true },
        ],
      },
      {
        id: "applicantInfo",
        title: "Applicant Information",
        fields: [
          { id: "nin", label: "NIN", type: "text", required: true, minLength: 11 },
          { id: "bvn", label: "BVN", type: "text", required: true, minLength: 11 },
          { id: "title", label: "Title", type: "select", required: true, options: TITLE_OPTIONS },
          { id: "surname", label: "Surname", type: "text", required: true },
          { id: "firstName", label: "First name", type: "text", required: true },
          { id: "middleName", label: "Middle name", type: "text", required: false },
          { id: "gender", label: "Gender", type: "select", required: true, options: GENDER_OPTIONS },
          { id: "maritalStatus", label: "Marital status", type: "select", required: true, options: MARITAL_STATUS_OPTIONS },
          { id: "dateOfBirth", label: "Date of birth", type: "date", required: true },
          { id: "countryOfBirth", label: "Country of birth", type: "text", required: true },
          { id: "nationality", label: "Nationality", type: "text", required: true },
          { id: "stateOfOrigin", label: "State of origin", type: "select", required: true, options: NIGERIAN_STATE_OPTIONS },
          { id: "lga", label: "LGA", type: "text", required: true },
          { id: "mothersMaidenName", label: "Mother's maiden name", type: "text", required: true },
          { id: "residentialAddress", label: "Residential address", type: "textarea", required: true },
          { id: "nearestBusStop", label: "Nearest bus stop", type: "text", required: true },
          { id: "city", label: "City", type: "text", required: true },
          { id: "stateOfResidence", label: "State of residence", type: "select", required: true, options: NIGERIAN_STATE_OPTIONS },
          { id: "occupation", label: "Occupation", type: "text", required: true },
          { id: "phone", label: "Phone number", type: "tel", required: true },
          { id: "email", label: "Email address", type: "email", required: true },
          { id: "bankName", label: "Bank name", type: "text", required: true },
          { id: "accountNumber", label: "Account number", type: "text", required: true, minLength: 10 },
        ],
      },
      {
        id: "nextOfKin",
        title: "Next of Kin",
        fields: [
          { id: "nokTitle", label: "Title", type: "select", required: true, options: TITLE_OPTIONS },
          { id: "nokSurname", label: "Surname", type: "text", required: true },
          { id: "nokFirstName", label: "First name", type: "text", required: true },
          { id: "nokMiddleName", label: "Middle name", type: "text", required: false },
          { id: "nokDateOfBirth", label: "Date of birth", type: "date", required: true },
          { id: "nokRelationship", label: "Relationship", type: "select", required: true, options: NEXT_OF_KIN_RELATIONSHIP_OPTIONS },
          { id: "nokGender", label: "Gender", type: "select", required: true, options: GENDER_OPTIONS },
          { id: "nokPhone", label: "Phone number", type: "tel", required: true },
          { id: "nokEmail", label: "Email", type: "email", required: false },
          { id: "nokResidentialAddress", label: "Residential address", type: "textarea", required: true },
          { id: "nokNearestBusStop", label: "Nearest bus stop", type: "text", required: false },
          { id: "nokCity", label: "City", type: "text", required: true },
          { id: "nokState", label: "State", type: "select", required: true, options: NIGERIAN_STATE_OPTIONS },
          { id: "nokLga", label: "LGA", type: "text", required: true },
        ],
      },
    ],
    extractContact: (v) => ({
      name: [v.title, v.firstName, v.middleName, v.surname].filter(Boolean).join(" "),
      email: v.email ?? "",
      phone: v.phone ?? "",
    }),
  },

  FLIGHT_BOOKING: {
    type: "FLIGHT_BOOKING",
    cmsSlug: "flight-booking",
    title: "Flight Booking",
    summary: "Domestic and international flight reservations with competitive pricing.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "flightDetails",
        title: "Flight Details",
        fields: [
          { id: "departure", label: "Departure city/airport", type: "text", required: true },
          { id: "destination", label: "Destination city/airport", type: "text", required: true },
          { id: "travelDate", label: "Travel date", type: "date", required: true },
          { id: "returnDate", label: "Return date (if round trip)", type: "date", required: false },
          { id: "passengers", label: "Number of passengers", type: "number", required: true },
          { id: "cabinClass", label: "Cabin class", type: "select", required: true, options: CABIN_CLASS_OPTIONS },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  HOTEL_RESERVATION: {
    type: "HOTEL_RESERVATION",
    cmsSlug: "hotel-reservations",
    title: "Hotel Reservations",
    summary: "Comfortable accommodation booking across local and international destinations.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "hotelDetails",
        title: "Reservation Details",
        fields: [
          { id: "destination", label: "Destination / city", type: "text", required: true },
          { id: "checkInDate", label: "Check-in date", type: "date", required: true },
          { id: "checkOutDate", label: "Check-out date", type: "date", required: true },
          { id: "numberOfGuests", label: "Number of guests", type: "number", required: true },
          { id: "roomPreference", label: "Room preference", type: "select", required: true, options: ROOM_PREFERENCE_OPTIONS },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  TRAVEL_INSURANCE: {
    type: "TRAVEL_INSURANCE",
    cmsSlug: "travel-insurance",
    title: "Travel Insurance",
    summary: "Reliable travel insurance plans that protect you before and during every journey.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "insuranceDetails",
        title: "Coverage Details",
        fields: [
          { id: "destination", label: "Destination", type: "text", required: true },
          { id: "travelStartDate", label: "Travel start date", type: "date", required: true },
          { id: "travelEndDate", label: "Travel end date", type: "date", required: true },
          { id: "numberOfTravelers", label: "Number of travelers", type: "number", required: true },
          { id: "coverageType", label: "Coverage type", type: "select", required: true, options: TRAVEL_INSURANCE_COVERAGE_OPTIONS },
          {
            id: "existingMedicalConditions",
            label: "Existing medical conditions (optional)",
            type: "textarea",
            required: false,
            helpText: "Only if relevant to your coverage — leave blank if none.",
          },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  LOGISTICS: {
    type: "LOGISTICS",
    cmsSlug: "logistics",
    title: "Logistics",
    summary: "Efficient cargo, delivery and logistics solutions locally and internationally.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "logisticsDetails",
        title: "Shipment Details",
        fields: [
          { id: "pickupAddress", label: "Pickup address", type: "textarea", required: true },
          { id: "deliveryAddress", label: "Delivery address", type: "textarea", required: true },
          { id: "packageDescription", label: "Package description", type: "textarea", required: true },
          { id: "weight", label: "Weight (kg)", type: "number", required: true },
          { id: "deliveryDate", label: "Preferred delivery date", type: "date", required: true },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  PROCUREMENT: {
    type: "PROCUREMENT",
    cmsSlug: "procurement-merchandise",
    title: "Procurement & General Merchandise",
    summary: "Reliable sourcing and procurement solutions for organizations and individuals.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "procurementDetails",
        title: "Order Details",
        fields: [
          { id: "itemDescription", label: "Item description", type: "textarea", required: true },
          { id: "quantity", label: "Quantity", type: "number", required: true },
          { id: "budget", label: "Budget", type: "number", required: true },
          { id: "deliveryAddress", label: "Delivery address", type: "textarea", required: true },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  EVENT_COORDINATION: {
    type: "EVENT_COORDINATION",
    cmsSlug: "event-coordination",
    title: "Event Coordination",
    summary: "Professional planning and coordination for business trips, conferences and special occasions.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "eventDetails",
        title: "Event Details",
        fields: [
          { id: "eventType", label: "Event type", type: "text", required: true, placeholder: "e.g. Wedding, conference, birthday" },
          { id: "location", label: "Location", type: "text", required: true },
          { id: "guestCount", label: "Guest count", type: "number", required: true },
          { id: "eventDate", label: "Event date", type: "date", required: true },
          { id: "specialRequests", label: "Special requests", type: "textarea", required: false },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  BEAUTY_SERVICES: {
    type: "BEAUTY_SERVICES",
    cmsSlug: "beauty-services",
    title: "Beauty Services",
    summary: "Professional beauty and personal care services delivered with excellence.",
    documents: GENERAL_DOCUMENTS.map((d) => ({ ...d, required: false })), // rarely need ID for a beauty booking
    sections: [
      contactSection(),
      {
        id: "beautyDetails",
        title: "Appointment Details",
        fields: [
          { id: "serviceRequired", label: "Service required", type: "text", required: true, placeholder: "e.g. Bridal makeup, hair styling" },
          { id: "appointmentDate", label: "Appointment date", type: "date", required: true },
          { id: "preferredTime", label: "Preferred time", type: "text", required: true, placeholder: "e.g. 10:00 AM" },
          { id: "notes", label: "Notes", type: "textarea", required: false },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },
};

export function getServiceApplicationConfig(type: string): ServiceApplicationConfig | null {
  return SERVICE_APPLICATION_CONFIGS[type as ServiceApplicationType] ?? null;
}

export const SERVICE_APPLICATION_TYPES = Object.keys(SERVICE_APPLICATION_CONFIGS) as ServiceApplicationType[];

/** URL-friendly path segment used for /apply/[pathSlug]. Falls back to the
 *  lowercased type when there's no matching CMS service (Proof of Funds). */
export function getApplicationPathSlug(type: ServiceApplicationType): string {
  const config = SERVICE_APPLICATION_CONFIGS[type];
  return config.cmsSlug ?? "proof-of-funds";
}

export function getServiceTypeFromPathSlug(pathSlug: string): ServiceApplicationType | null {
  const match = Object.values(SERVICE_APPLICATION_CONFIGS).find(
    (config) => (config.cmsSlug ?? "proof-of-funds") === pathSlug
  );
  return match?.type ?? null;
}
