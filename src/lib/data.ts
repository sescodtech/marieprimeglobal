// Phase 1 static content.
// Shaped to match the Prisma models (Service, Testimonial, DirectorProfile,
// SiteSetting) so that in Phase 2 these arrays are replaced by
// `await prisma.service.findMany(...)` etc. without touching the components
// that consume them.
//
// The `Service` content itself now lives in `./servicePages.ts` (seed source
// for the Prisma `Service` table) and is edited live via /admin/services —
// see that file for the single canonical service list.

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
    "Maria founded MariePrime Global Services to bring structure and honesty to an industry known for neither. With a background spanning international travel logistics and cross-border business advisory, she built MariePrime around a simple standard: every client gets the same clear process, the same realistic timelines, and the same direct communication, regardless of how large or small the request.",
  photoUrl: null as string | null,
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Enquiry",
    description:
      "Tell us what you're trying to get done. A representative reviews your request within 24–48 hours.",
  },
  {
    step: "02",
    title: "Consultation",
    description:
      "We assess your situation, lay out realistic timelines and costs, and agree the plan in writing.",
  },
  {
    step: "03",
    title: "Documentation",
    description:
      "Your dedicated contact prepares and checks every document against current requirements.",
  },
  {
    step: "04",
    title: "Processing",
    description:
      "We submit, track and follow up with airlines, institutions or immigration bodies on your behalf.",
  },
  {
    step: "05",
    title: "Delivery",
    description:
      "Confirmed booking, approved visa, or completed registration — handed to you, done properly.",
  },
];

export type StatItem = {
  value: number;
  suffix?: string;
  label: string;
};

export const companyStats: StatItem[] = [
  { value: 500, suffix: "+", label: "Clients served" },
  { value: 98, suffix: "%", label: "Visa success rate" },
  { value: 6, suffix: "", label: "Countries covered" },
  { value: 24, suffix: "hrs", label: "Average first response" },
];

export type Destination = {
  code: string;
  country: string;
  highlight: string;
  services: string[];
};

export const destinations: Destination[] = [
  {
    code: "CAN",
    country: "Canada",
    highlight: "Study, work or relocate to Canada with step-by-step support.",
    services: ["Study", "Visa", "Relocation"],
  },
  {
    code: "UK",
    country: "United Kingdom",
    highlight: "Admissions and visa support for UK study and business.",
    services: ["Study", "Visa", "Business"],
  },
  {
    code: "USA",
    country: "United States",
    highlight: "Comprehensive travel and study solutions for US destinations.",
    services: ["Travel", "Study", "Visa"],
  },
  {
    code: "AUS",
    country: "Australia",
    highlight: "Permanent and temporary migration pathways supported end-to-end.",
    services: ["Visa", "Relocation"],
  },
  {
    code: "GER",
    country: "Germany",
    highlight: "Study and work routes with local partner guidance.",
    services: ["Study", "Work Visa"],
  },
  {
    code: "IRL",
    country: "Ireland",
    highlight: "Study and immigration guidance for Ireland's universities and employers.",
    services: ["Study", "Visa"],
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedLabel: string; // display-only date label; Phase 5 CMS will replace with real DateTime
};

export const blogPosts: BlogPost[] = [
  {
    slug: "uk-study-visa-documentation-mistakes",
    category: "Study Abroad",
    title: "Five documentation mistakes that delay UK study visas",
    excerpt:
      "The most common refusals trace back to a handful of avoidable errors in financial and academic documentation.",
    readTime: "5 min read",
    publishedLabel: "June 2026",
  },
  {
    slug: "canada-express-entry-changes",
    category: "Immigration",
    title: "What changed in Canada's express entry system this year",
    excerpt:
      "A practical breakdown of recent changes and what they mean for applicants planning a move.",
    readTime: "6 min read",
    publishedLabel: "May 2026",
  },
  {
    slug: "how-early-to-book-flights",
    category: "Travel",
    title: "How far in advance should you actually book flights?",
    excerpt:
      "The 'book early' advice isn't wrong, but it isn't the whole story either. Here's what the data shows.",
    readTime: "4 min read",
    publishedLabel: "May 2026",
  },
  {
    slug: "reading-a-visa-refusal-letter",
    category: "Visa Assistance",
    title: "How to actually read a visa refusal letter",
    excerpt:
      "Refusal letters are written in cautious, formal language. Here's how to find the real reason underneath it.",
    readTime: "5 min read",
    publishedLabel: "April 2026",
  },
  {
    slug: "business-registration-timeline-nigeria",
    category: "Business",
    title: "What a business registration timeline actually looks like",
    excerpt:
      "From name reservation to certificate in hand — a realistic week-by-week walk-through, not the optimistic version.",
    readTime: "6 min read",
    publishedLabel: "April 2026",
  },
  {
    slug: "funding-your-travel-plans",
    category: "Travel Loans",
    title: "Financing a trip without derailing your plans",
    excerpt:
      "When travel financing makes sense, what lenders look for, and how to prepare documentation that doesn't stall approval.",
    readTime: "4 min read",
    publishedLabel: "March 2026",
  },
];

export type JobListing = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
};

export const jobListings: JobListing[] = [
  {
    slug: "visa-immigration-consultant",
    title: "Visa & Immigration Consultant",
    department: "Client Services",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
    summary:
      "Guide clients through visa and immigration applications end to end, from documentation review to interview preparation.",
  },
  {
    slug: "study-abroad-advisor",
    title: "Study Abroad Advisor",
    department: "Client Services",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
    summary:
      "Support prospective international students through school selection, admissions paperwork and pre-departure planning.",
  },
  {
    slug: "client-relationship-officer",
    title: "Client Relationship Officer",
    department: "Operations",
    location: "Lagos, Nigeria (On-site)",
    type: "Full-time",
    summary:
      "Own the client experience from first enquiry to completed service, keeping every request moving on schedule.",
  },
];

export type FaqCategory = {
  category: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    category: "General",
    items: [
      {
        question: "What services does MariePrime Global provide?",
        answer:
          "Flight booking, visa and immigration assistance, travel loans, study abroad support and business registration — all under one point of contact.",
      },
      {
        question: "Do you work with clients outside Nigeria?",
        answer:
          "Yes. Most communication happens by phone, email and WhatsApp, so location isn't a barrier to working with us.",
      },
      {
        question: "What does MariePrime charge for its services?",
        answer:
          "Fees are agreed upfront in writing before any work begins, so there are no surprise costs partway through your process.",
      },
    ],
  },
  {
    category: "Visa & Immigration",
    items: [
      {
        question: "How long does a typical visa application take?",
        answer:
          "It depends on the destination and visa type, but most applications move from documentation to decision within 4–8 weeks. We give you a realistic estimate for your specific case before you commit.",
      },
      {
        question: "Do you guarantee visa approval?",
        answer:
          "No agency honestly can. What we guarantee is that your application is built correctly, complete, and submitted on time — the factors actually within our control.",
      },
      {
        question: "Can you help if my visa was refused before?",
        answer:
          "Yes. We review the previous refusal, identify what likely caused it, and rebuild the application to address those gaps directly.",
      },
    ],
  },
  {
    category: "Study Abroad",
    items: [
      {
        question: "Can you help me choose a school or course?",
        answer:
          "Yes. We assess your academic background, budget and destination preferences and shortlist realistic options before any application work begins.",
      },
      {
        question: "Do you handle scholarship applications?",
        answer:
          "We help identify scholarship opportunities you may qualify for and support the documentation, though outcomes are ultimately decided by the awarding institution.",
      },
    ],
  },
  {
    category: "Travel & Payments",
    items: [
      {
        question: "How do I pay for flights or services booked through you?",
        answer:
          "Payment methods and timelines are confirmed with your representative before booking, with everything documented in writing.",
      },
      {
        question: "What happens if my flight or travel plan changes?",
        answer:
          "Contact your representative as early as possible. We handle changes and emergencies while you're already travelling, not just before departure.",
      },
    ],
  },
];

export const siteContent = {
  brand: {
    name: "MariePrime Global Services Ltd",
    shortName: "MariePrime",
    tagline: "Your journey, handled with precision.",
  },
  home: {
    heroEyebrow: "Global Mobility & Business Advisory",
    heroHeadline: "Precision-led travel, immigration and business services.",
    heroSubtext:
      "MariePrime Global Services delivers flight bookings, visa approvals, study placements and business registration with the discipline global organisations expect — one dedicated contact, from first enquiry to final approval.",
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
      { value: "5", label: "Core service lines" },
      { value: "24/48hrs", label: "Typical first response" },
      { value: "1", label: "Dedicated contact per client" },
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
