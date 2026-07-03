// Phase 1 static content.
// Shaped to match the Prisma models (Service, Testimonial, DirectorProfile,
// SiteSetting) so that in Phase 2 these arrays are replaced by
// `await prisma.service.findMany(...)` etc. without touching the components
// that consume them.

export type ServiceItem = {
  slug: string;
  title: string;
  routeCode: string; // boarding-pass style journey code — the site's signature motif
  routeFrom: string;
  routeTo: string;
  summary: string;
  description: string;
};

export const services: ServiceItem[] = [
  {
    slug: "flight-booking",
    title: "Flight Booking & Travel Solutions",
    routeCode: "MPG 101",
    routeFrom: "LOS",
    routeTo: "ANY",
    summary:
      "Flights, itineraries and travel logistics handled end to end, for business and leisure.",
    description:
      "We source, compare and book flights across major airlines and alliances, build multi-city itineraries, and handle changes or emergencies while you travel. Every booking comes with a dedicat[...]",
  },
  {
    slug: "visa-immigration",
    title: "Visa & Immigration Assistance",
    routeCode: "MPG 202",
    routeFrom: "APPLY",
    routeTo: "APPROVED",
    summary:
      "Guidance through visa applications and immigration processes, from documentation to interview.",
    description:
      "From document checklists to interview preparation, we guide applicants through tourist, business, work and residency visa processes for major destinations, reducing the errors that cause av[...]",
  },
  {
    slug: "travel-loan",
    title: "Travel Loan Assistance",
    routeCode: "MPG 303",
    routeFrom: "NEED",
    routeTo: "FUNDED",
    summary:
      "Structured loan support to help qualified clients fund flights, visas and relocation costs.",
    description:
      "We connect qualified clients with structured travel financing options and help prepare the documentation lenders require, so travel plans aren't held up by cash flow timing.",
  },
  {
    slug: "study-abroad",
    title: "Study Abroad Support",
    routeCode: "MPG 404",
    routeFrom: "HOME",
    routeTo: "CAMPUS",
    summary:
      "School selection, admissions guidance and travel planning for international students.",
    description:
      "We support prospective international students from school and course selection through admissions paperwork, visa applications, and pre-departure travel planning — one point of contact fo[...]",
  },
  {
    slug: "business-registration",
    title: "Business Registration Services",
    routeCode: "MPG 505",
    routeFrom: "IDEA",
    routeTo: "REGISTERED",
    summary:
      "Company incorporation and regulatory registration handled correctly, the first time.",
    description:
      "We manage company name reservation, incorporation, and regulatory registration for new businesses, keeping founders focused on building rather than paperwork.",
  },
  {
    slug: "investment-business-support",
    title: "Investment & Business Support",
    routeCode: "MPG 606",
    routeFrom: "CAPITAL",
    routeTo: "GROWTH",
    summary:
      "Advisory support for clients exploring investment opportunities and business expansion.",
    description:
      "We advise individuals and businesses exploring new investment opportunities or cross-border expansion, providing structure and due-diligence support around the decisions that matter.",
  },
];

export type TestimonialItem = {
  clientName: string;
  clientRole: string;
  quote: string;
  rating: number;
};

export const testimonials: TestimonialItem[] = [
  {
    clientName: "Adaeze N.",
    clientRole: "Study Abroad Client",
    quote:
      "MariePrime handled my UK admission and visa paperwork while I focused on finishing my final exams. Every update came before I had to ask for it.",
    rating: 5,
  },
  {
    clientName: "Emeka O.",
    clientRole: "Business Registration Client",
    quote:
      "I expected weeks of back and forth with CAC. MariePrime had my company registered and documents in hand faster than I planned for.",
    rating: 5,
  },
  {
    clientName: "Fatima B.",
    clientRole: "Visa & Travel Client",
    quote:
      "My visa had been refused once before with another agent. MariePrime rebuilt the application properly and it was approved on the second attempt.",
    rating: 5,
  },
];

export const directorProfile = {
  name: "Maria Karinate Iyabi",
  position: "Director",
  biography:
    "Maria founded MariePrime Global Services to bring structure and honesty to an industry known for neither. With a background spanning international travel logistics and cross-border business [...]",
  photoUrl: null as string | null,
};

export const siteContent = {
  brand: {
    name: "MariePrime Global Services Ltd",
    shortName: "MariePrime",
    tagline: "Your journey, handled with precision.",
  },
  home: {
    heroEyebrow: "Global Mobility, Engineered With Precision",
    heroHeadline: "Somewhere in the world, your next chapter is waiting.",
    heroSubtext:
      "From visa approvals and funded flights to study placements and registered businesses, MariePrime Global Services turns global ambition into confirmed outcomes — one dedicated contact, transparent pricing, and documentation built to withstand scrutiny, every step from application to arrival.",
    // Cloudinary public id for the hero background image — editable via admin later
    heroImagePublicId: "marieprime/hero-travel-1",
    whyChoose: [
      {
        title: "One point of contact",
        description:
          "A single dedicated contact follows your request from first enquiry to completion — no handoffs, no repeating yourself.",
      },
      {
        title: "Realistic timelines",
        description:
          "We tell you what a process actually takes, including where delays are likely, before you commit.",
      },
      {
        title: "Documentation done properly",
        description:
          "Most refusals and delays trace back to paperwork. We build every application to withstand scrutiny.",
      },
      {
        title: "Transparent costs",
        description:
          "Fees are agreed upfront in writing. What you're quoted is what you pay.",
      },
    ],
    trustStats: [
      { value: "6", label: "Core service lines" },
      { value: "24/48hrs", label: "Typical first response" },
      { value: "1", label: "Dedicated contact per client" },
    ],
    featuredDestinations: [
      {
        slug: "canada",
        title: "Canada",
        country: "Canada",
        blurb: "Study, work or relocate to Canada with step-by-step support.",
        imagePublicId: "marieprime/dest-canada",
      },
      {
        slug: "united-kingdom",
        title: "United Kingdom",
        country: "United Kingdom",
        blurb: "Admissions and visa support for UK study and business.",
        imagePublicId: "marieprime/dest-uk",
      },
      {
        slug: "united-states",
        title: "United States",
        country: "United States",
        blurb: "Comprehensive travel and study solutions for US destinations.",
        imagePublicId: "marieprime/dest-usa",
      },
      {
        slug: "australia",
        title: "Australia",
        country: "Australia",
        blurb: "Permanent and temporary migration pathways supported end-to-end.",
        imagePublicId: "marieprime/dest-aus",
      },
      {
        slug: "germany",
        title: "Germany",
        country: "Germany",
        blurb: "Study and work routes with local partner guidance.",
        imagePublicId: "marieprime/dest-germany",
      },
      {
        slug: "ireland",
        title: "Ireland",
        country: "Ireland",
        blurb: "Study and immigration guidance for Ireland's universities and employers.",
        imagePublicId: "marieprime/dest-ireland",
      },
    ],
  },
  about: {
    mission:
      "To make international travel, immigration and business processes clear, honest and achievable for every client we work with.",
    vision:
      "To be the most trusted name in global mobility and business services across the markets we serve.",
    values: [
      {
        title: "Precision",
        description: "Every document, date and detail checked before it leaves our hands.",
      },
      {
        title: "Integrity",
        description: "We tell clients the truth about their odds and timelines, even when it isn't what they want to hear.",
      },
      {
        title: "Accessibility",
        description: "Direct communication with real people, not ticket queues.",
      },
      {
        title: "Excellence",
        description: "We hold our own work to a higher standard than the process requires.",
      },
    ],
  },
  contact: {
    email: "mariaiyabi@gmail.com",
    phone: "+2347069660521",
    whatsapp: "2347069660521",
    address: "House 12, 71 Road A Close, Festac Town, Lagos, Lagos State, Nigeria",
    socials: {
      instagram: "https://instagram.com/marieprimeglobal",
      linkedin: "https://linkedin.com/company/marieprimeglobal",
      facebook: "https://facebook.com/marieprimeglobal",
    },
  },
};
