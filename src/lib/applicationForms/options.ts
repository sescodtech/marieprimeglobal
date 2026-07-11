import type { FieldOption } from "./types";

export const TITLE_OPTIONS: FieldOption[] = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Miss", label: "Miss" },
  { value: "Dr", label: "Dr" },
  { value: "Chief", label: "Chief" },
  { value: "Engr", label: "Engr" },
  { value: "Prof", label: "Prof" },
];

export const GENDER_OPTIONS: FieldOption[] = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const MARITAL_STATUS_OPTIONS: FieldOption[] = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
];

export const NEXT_OF_KIN_RELATIONSHIP_OPTIONS: FieldOption[] = [
  { value: "Spouse", label: "Spouse" },
  { value: "Parent", label: "Parent" },
  { value: "Sibling", label: "Sibling" },
  { value: "Child", label: "Child" },
  { value: "Relative", label: "Relative" },
  { value: "Friend", label: "Friend" },
];

export const NIGERIAN_STATE_OPTIONS: FieldOption[] = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
].map((state) => ({ value: state, label: state }));

export const CABIN_CLASS_OPTIONS: FieldOption[] = [
  { value: "Economy", label: "Economy" },
  { value: "Premium Economy", label: "Premium Economy" },
  { value: "Business", label: "Business" },
  { value: "First Class", label: "First Class" },
];

export const ROOM_PREFERENCE_OPTIONS: FieldOption[] = [
  { value: "Single", label: "Single" },
  { value: "Double", label: "Double" },
  { value: "Twin", label: "Twin" },
  { value: "Suite", label: "Suite" },
];

export const TRAVEL_INSURANCE_COVERAGE_OPTIONS: FieldOption[] = [
  { value: "Single Trip", label: "Single Trip" },
  { value: "Annual Multi-Trip", label: "Annual Multi-Trip" },
  { value: "Family", label: "Family" },
  { value: "Student", label: "Student" },
];
