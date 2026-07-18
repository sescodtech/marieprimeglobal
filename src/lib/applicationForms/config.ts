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
  FUNDING_SOURCE_OPTIONS,
  TRAVEL_PACKAGE_TYPE_OPTIONS,
  LOAN_PURPOSE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  ADMISSION_STATUS_OPTIONS,
  BUSINESS_STRUCTURE_OPTIONS,
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

// One config per real service seeded in servicePages.ts (cmsSlug below must
// match that file's `slug` field exactly), plus PROOF_OF_FUNDS, which is a
// standalone add-on with no CMS page of its own.
export const SERVICE_APPLICATION_CONFIGS: Record<ServiceApplicationType, ServiceApplicationConfig> = {
  STUDY_ABROAD: {
    type: "STUDY_ABROAD",
    cmsSlug: "study-abroad",
    title: "Study Abroad",
    summary: "School selection, admissions guidance and travel planning for international students.",
    documents: [
      { id: "validId", label: "Valid means of identification", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "academicTranscript", label: "Most recent academic transcript", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "supportingDocument", label: "Supporting document (optional)", required: false, accept: "image/jpeg,image/png,application/pdf" },
    ],
    sections: [
      contactSection(),
      {
        id: "studyDetails",
        title: "Study Plans",
        fields: [
          { id: "highestQualification", label: "Highest qualification completed", type: "text", required: true, placeholder: "e.g. WAEC, BSc, HND" },
          { id: "fieldOfStudy", label: "Preferred field of study", type: "text", required: true },
          { id: "preferredCountries", label: "Preferred destination countries", type: "text", required: true, placeholder: "e.g. UK, Canada, USA" },
          { id: "preferredIntake", label: "Preferred intake", type: "text", required: true, placeholder: "e.g. September 2027" },
          { id: "fundingSource", label: "Funding source", type: "select", required: true, options: FUNDING_SOURCE_OPTIONS },
          { id: "additionalNotes", label: "Anything else we should know", type: "textarea", required: false },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  VISA: {
    type: "VISA",
    cmsSlug: "visa-assistance",
    title: "Visa Assistance",
    summary: "Guided visa applications for tourist, business, work and study routes.",
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

  TRAVEL_PACKAGES: {
    type: "TRAVEL_PACKAGES",
    cmsSlug: "travel-packages",
    title: "Travel Packages",
    summary: "Flights, stays and logistics assembled into one coordinated itinerary.",
    documents: GENERAL_DOCUMENTS,
    sections: [
      contactSection(),
      {
        id: "packageDetails",
        title: "Package Details",
        fields: [
          { id: "destination", label: "Destination", type: "text", required: true },
          { id: "travelStartDate", label: "Travel start date", type: "date", required: true },
          { id: "travelEndDate", label: "Travel end date", type: "date", required: true },
          { id: "travellerCount", label: "Number of travellers", type: "number", required: true },
          { id: "packageType", label: "Package type", type: "select", required: true, options: TRAVEL_PACKAGE_TYPE_OPTIONS },
          { id: "budget", label: "Approximate budget", type: "number", required: false },
          { id: "specialRequests", label: "Special requests", type: "textarea", required: false },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  FLIGHT_BOOKING: {
    type: "FLIGHT_BOOKING",
    cmsSlug: "flight-reservations",
    title: "Flight Reservations",
    summary: "Flights sourced, compared and booked across major airlines, with in-transit support.",
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
    cmsSlug: "hotel-bookings",
    title: "Hotel Bookings",
    summary: "Accommodation sourced and confirmed to match your itinerary and budget.",
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
    summary: "Cover matched to your destination, trip length and visa requirements.",
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

  SCHOLARSHIP_ASSISTANCE: {
    type: "SCHOLARSHIP_ASSISTANCE",
    cmsSlug: "scholarship-assistance",
    title: "Scholarship Assistance",
    summary: "Funding opportunities matched to your profile, with hands-on application support.",
    documents: [
      { id: "validId", label: "Valid means of identification", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "academicTranscript", label: "Most recent academic transcript", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "supportingDocument", label: "Supporting document (optional)", required: false, accept: "image/jpeg,image/png,application/pdf" },
    ],
    sections: [
      contactSection(),
      {
        id: "scholarshipDetails",
        title: "Academic Profile",
        fields: [
          { id: "fieldOfStudy", label: "Field of study", type: "text", required: true },
          { id: "preferredCountries", label: "Preferred destination countries", type: "text", required: true },
          { id: "currentQualification", label: "Current/highest qualification", type: "text", required: true },
          { id: "gpaOrGrade", label: "GPA / grade average", type: "text", required: false },
          { id: "fundingNeed", label: "What level of funding are you seeking?", type: "textarea", required: true, placeholder: "e.g. Full tuition, partial, living costs only" },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  TRAVEL_LOANS: {
    type: "TRAVEL_LOANS",
    cmsSlug: "travel-loans",
    title: "Travel Loans",
    summary: "Structured financing for flights, visas and relocation costs.",
    documents: [
      { id: "validId", label: "Valid means of identification", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "proofOfIncome", label: "Proof of income (optional)", required: false, accept: "image/jpeg,image/png,application/pdf" },
    ],
    sections: [
      contactSection(),
      {
        id: "loanDetails",
        title: "Financing Needs",
        fields: [
          { id: "loanPurpose", label: "What is this financing for?", type: "select", required: true, options: LOAN_PURPOSE_OPTIONS },
          { id: "amountNeeded", label: "Amount needed", type: "number", required: true },
          { id: "employmentStatus", label: "Employment status", type: "select", required: true, options: EMPLOYMENT_STATUS_OPTIONS },
          { id: "requiredByDate", label: "Funds needed by", type: "date", required: true },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  EDUCATION_LOANS: {
    type: "EDUCATION_LOANS",
    cmsSlug: "education-loans",
    title: "Education Loans",
    summary: "Tuition financing coordinated with your visa's financial proof requirements.",
    documents: [
      { id: "validId", label: "Valid means of identification", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "admissionLetter", label: "Admission letter (if available)", required: false, accept: "image/jpeg,image/png,application/pdf" },
    ],
    sections: [
      contactSection(),
      {
        id: "educationLoanDetails",
        title: "Tuition Financing Needs",
        fields: [
          { id: "institution", label: "Institution", type: "text", required: true },
          { id: "programme", label: "Programme / course", type: "text", required: true },
          { id: "tuitionAmount", label: "Total tuition amount", type: "number", required: true },
          { id: "admissionStatus", label: "Admission status", type: "select", required: true, options: ADMISSION_STATUS_OPTIONS },
          { id: "visaDeadline", label: "Visa or tuition deadline (if known)", type: "date", required: false },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  CORPORATE_TRAVEL: {
    type: "CORPORATE_TRAVEL",
    cmsSlug: "corporate-travel",
    title: "Corporate Travel",
    summary: "Managed flights, stays and logistics for business travellers and teams.",
    documents: GENERAL_DOCUMENTS.map((d) => ({ ...d, required: false })), // a company contact may not have personal ID handy at enquiry stage
    sections: [
      contactSection(),
      {
        id: "corporateDetails",
        title: "Company & Trip Details",
        fields: [
          { id: "companyName", label: "Company name", type: "text", required: true },
          { id: "travellerCount", label: "Number of travellers", type: "number", required: true },
          { id: "destinations", label: "Destination(s)", type: "text", required: true },
          { id: "travelDates", label: "Travel dates", type: "text", required: true, placeholder: "e.g. 12–18 Sept 2027" },
          { id: "budgetBand", label: "Approved travel budget band (optional)", type: "text", required: false },
          { id: "notes", label: "Additional notes", type: "textarea", required: false },
        ],
      },
    ],
    extractContact: (v) => ({ name: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" }),
  },

  BUSINESS_REGISTRATION: {
    type: "BUSINESS_REGISTRATION",
    cmsSlug: "business-registration",
    title: "Business Registration Services",
    summary: "Company name reservation, incorporation and regulatory registration for new businesses.",
    documents: [
      { id: "validId", label: "Valid means of identification", required: true, accept: "image/jpeg,image/png,application/pdf" },
      { id: "passportPhoto", label: "Passport photograph", required: true, accept: "image/jpeg,image/png" },
      { id: "supportingDocument", label: "Supporting document (optional)", required: false, accept: "image/jpeg,image/png,application/pdf" },
    ],
    sections: [
      contactSection(),
      {
        id: "businessDetails",
        title: "Business Details",
        fields: [
          { id: "proposedBusinessName", label: "Proposed business name", type: "text", required: true },
          { id: "alternativeBusinessName", label: "Alternative business name", type: "text", required: false },
          { id: "businessStructure", label: "Business structure", type: "select", required: true, options: BUSINESS_STRUCTURE_OPTIONS },
          { id: "businessAddress", label: "Proposed business address", type: "textarea", required: true },
          { id: "businessObjectives", label: "Nature of business / objectives", type: "textarea", required: true },
          { id: "numberOfDirectors", label: "Number of directors/partners", type: "number", required: true },
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
