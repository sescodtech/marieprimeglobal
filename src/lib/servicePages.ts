// Seed content for the Prisma `Service` table (single canonical service
// list — 11 services in total, covering the master spec's 10 plus Business
// Registration, which the business also actually offers). After the initial
// seed, edit services via /admin/services rather than here.

export type ServiceBenefit = {
  title: string;
  description: string;
};

export type ServiceProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServicePageContent = {
  slug: string;
  title: string;
  routeCode: string;
  routeFrom: string;
  routeTo: string;
  tagline: string;
  summary: string;
  overview: string;
  benefits: ServiceBenefit[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "study-abroad",
    title: "Study Abroad",
    routeCode: "MPG-STA",
    routeFrom: "HOME",
    routeTo: "CAMPUS",
    tagline: "From shortlist to student visa, without the guesswork.",
    summary:
      "School selection, admissions guidance and travel planning for international students.",
    overview:
      "We support prospective international students from school and course selection through admissions paperwork, funding proof, visa applications, and pre-departure planning — one point of contact for the entire journey, not a different office for each step.",
    benefits: [
      { title: "Realistic school shortlists", description: "We match your academic profile and budget against actual admission odds, not aspirational lists." },
      { title: "Admissions paperwork done right", description: "Transcripts, SOPs and reference letters checked against each institution's specific requirements." },
      { title: "Funding proof prepared properly", description: "We help structure financial documentation so it withstands visa officer scrutiny." },
      { title: "Pre-departure support", description: "Housing guidance, orientation checklists and a contact who stays reachable after you land." },
    ],
    process: [
      { step: "01", title: "Profile review", description: "We assess your academic background, budget and destination preference." },
      { step: "02", title: "School shortlist", description: "A realistic set of institutions and courses, ranked by fit and admission likelihood." },
      { step: "03", title: "Applications & funding", description: "Admissions paperwork submitted alongside financial documentation for your visa." },
      { step: "04", title: "Visa & departure", description: "Visa application support through to a pre-departure briefing." },
    ],
    faqs: [
      { question: "Do I need to have a school in mind already?", answer: "No. Many clients start with a country or budget in mind and let us narrow down the school list from there." },
      { question: "Can you help with scholarship applications too?", answer: "Yes — see our dedicated Scholarship Assistance service for that part of the process." },
      { question: "What if my study visa is refused?", answer: "We review the refusal reason with you and, where the case supports it, help rebuild and resubmit the application." },
    ],
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    routeCode: "MPG-VSA",
    routeFrom: "APPLY",
    routeTo: "APPROVED",
    tagline: "Applications built to survive scrutiny, not just get submitted.",
    summary:
      "Guided visa applications for tourist, business, work and study routes.",
    overview:
      "From document checklists to interview preparation, we guide applicants through tourist, business, work and study visa processes for major destinations, reducing the errors that cause avoidable refusals.",
    benefits: [
      { title: "Document checklist built for your case", description: "Not a generic list — matched to your visa type, destination and history." },
      { title: "Interview preparation", description: "Realistic mock questions and guidance on how to answer them clearly." },
      { title: "Refusal review & reapplication", description: "If you've been refused before, we identify what likely caused it before reapplying." },
      { title: "Status tracking", description: "We follow up on your application's progress so you're not left guessing." },
    ],
    process: [
      { step: "01", title: "Eligibility check", description: "We confirm which visa category fits your situation before any paperwork begins." },
      { step: "02", title: "Documentation", description: "Every document reviewed against the destination's current requirements." },
      { step: "03", title: "Submission", description: "Application lodged correctly the first time, with a copy retained for your records." },
      { step: "04", title: "Decision support", description: "Interview prep where required, and guidance on next steps once a decision is issued." },
    ],
    faqs: [
      { question: "Do you guarantee visa approval?", answer: "No agency honestly can. We guarantee your application is complete, accurate and submitted correctly — the factors within our control." },
      { question: "How long does a typical application take?", answer: "It varies by destination and visa type, but most move from documentation to decision within 4–8 weeks." },
      { question: "I was refused before with another agent — can you still help?", answer: "Yes. We review the previous refusal letter and rebuild the application to address the specific gaps that caused it." },
    ],
  },
  {
    slug: "travel-packages",
    title: "Travel Packages",
    routeCode: "MPG-TPK",
    routeFrom: "PLAN",
    routeTo: "PACKAGED",
    tagline: "Flights, stays and logistics, planned as one trip — not three bookings.",
    summary:
      "Flights, stays and logistics assembled into one coordinated itinerary.",
    overview:
      "We assemble flights, accommodation and on-the-ground logistics into a single coordinated itinerary for leisure, family or group travel, so nothing is booked in isolation and nothing gets missed.",
    benefits: [
      { title: "One itinerary, not scattered bookings", description: "Flights, stays and transfers coordinated to actually connect with each other." },
      { title: "Group & family rates", description: "We negotiate on your behalf when booking for more than one traveller." },
      { title: "Built-in contingency", description: "Itineraries built with realistic buffers for delays and connections." },
      { title: "A single contact during travel", description: "One person to call if anything changes mid-trip." },
    ],
    process: [
      { step: "01", title: "Brief", description: "Destination, dates, budget and traveller count." },
      { step: "02", title: "Package build", description: "Flights, stays and logistics assembled and priced as one itinerary." },
      { step: "03", title: "Confirmation", description: "You review and approve before anything is paid for." },
      { step: "04", title: "Travel support", description: "A contact reachable for the duration of your trip." },
    ],
    faqs: [
      { question: "Can you build a package for a group?", answer: "Yes, including family trips, corporate groups and school trips." },
      { question: "Can I change dates after booking?", answer: "It depends on the airline and hotel's own change policies, which we confirm with you before you commit." },
      { question: "Do you handle visas for the destinations in the package too?", answer: "Yes — visa support can be added as part of the same engagement." },
    ],
  },
  {
    slug: "flight-reservations",
    title: "Flight Reservations",
    routeCode: "MPG-FLR",
    routeFrom: "LOS",
    routeTo: "ANY",
    tagline: "Flights sourced, compared and booked, with someone to call mid-trip.",
    summary:
      "Flights sourced, compared and booked across major airlines, with in-transit support.",
    overview:
      "We source, compare and book flights across major airlines and alliances, build multi-city itineraries, and handle changes or emergencies while you travel. Every booking comes with a dedicated reference and a human being to call.",
    benefits: [
      { title: "Fare comparison across alliances", description: "We check routes and alliances a standard search often misses." },
      { title: "Multi-city itineraries", description: "Complex routings planned and booked as one coherent trip." },
      { title: "In-transit support", description: "Delays, cancellations and rebookings handled while you're already travelling." },
      { title: "Dedicated booking reference", description: "One reference number, one contact, for the life of your booking." },
    ],
    process: [
      { step: "01", title: "Route & dates", description: "You share where and when; we source options across carriers." },
      { step: "02", title: "Comparison", description: "You get a shortlist with pricing and routing trade-offs explained plainly." },
      { step: "03", title: "Booking", description: "Ticket issued and confirmed, with your reference sent directly to you." },
      { step: "04", title: "Travel-day support", description: "We're reachable for changes or disruptions for the duration of your trip." },
    ],
    faqs: [
      { question: "Is booking through you more expensive than booking direct?", answer: "Our fares are sourced from the same inventory airlines sell from; the difference is the support attached to the booking." },
      { question: "What happens if my flight is cancelled?", answer: "Contact your representative immediately — we handle rebooking directly with the airline on your behalf." },
      { question: "Can you book connecting flights on different airlines?", answer: "Yes, including interline and separately-ticketed connections, with the risks explained upfront." },
    ],
  },
  {
    slug: "hotel-bookings",
    title: "Hotel Bookings",
    routeCode: "MPG-HTL",
    routeFrom: "ARRIVE",
    routeTo: "SETTLED",
    tagline: "Stays matched to your trip, not just the highest star rating.",
    summary:
      "Accommodation sourced and confirmed to match your itinerary and budget.",
    overview:
      "We source and book accommodation matched to your itinerary, budget and purpose of travel — business, study or leisure — confirming details directly with properties so there are no surprises at check-in.",
    benefits: [
      { title: "Matched to your itinerary", description: "Location chosen against your actual schedule, not generic tourist zones." },
      { title: "Confirmed directly with the property", description: "We verify reservation details before you travel, not after a problem arises." },
      { title: "Extended-stay rates", description: "Better terms negotiated for students and business travellers staying longer." },
      { title: "Change support", description: "Date or property changes handled on your behalf if plans shift." },
    ],
    process: [
      { step: "01", title: "Brief", description: "Destination, dates, budget and purpose of stay." },
      { step: "02", title: "Shortlist", description: "Options matched to your itinerary and confirmed for availability." },
      { step: "03", title: "Booking", description: "Reservation confirmed directly with the property." },
      { step: "04", title: "Pre-arrival check", description: "Details reconfirmed shortly before your check-in date." },
    ],
    faqs: [
      { question: "Can you book long-term student accommodation?", answer: "Yes, including extended stays tied to a study abroad placement." },
      { question: "What if I need to change my check-in date?", answer: "We handle changes directly with the property under its existing policy." },
      { question: "Do you book for corporate groups?", answer: "Yes — see also our Corporate Travel service for multi-traveller bookings." },
    ],
  },
  {
    slug: "travel-insurance",
    title: "Travel Insurance",
    routeCode: "MPG-TIN",
    routeFrom: "RISK",
    routeTo: "COVERED",
    tagline: "Cover matched to your actual trip, explained in plain language.",
    summary:
      "Cover matched to your destination, trip length and visa requirements.",
    overview:
      "We help you select travel insurance matched to your destination, trip length and visa requirements — many study and visa applications require proof of cover, and we make sure yours meets the specific standard requested.",
    benefits: [
      { title: "Matched to visa requirements", description: "Some destinations specify minimum cover levels; we confirm yours qualifies." },
      { title: "Plain-language comparison", description: "Policy terms explained without the fine-print runaround." },
      { title: "Claims guidance", description: "Support understanding the claims process before you need to use it." },
      { title: "Family & group cover", description: "Policies arranged for multiple travellers on one trip." },
    ],
    process: [
      { step: "01", title: "Requirements check", description: "We confirm what cover level your destination or visa actually requires." },
      { step: "02", title: "Policy shortlist", description: "Options compared on coverage, not just price." },
      { step: "03", title: "Purchase & documentation", description: "Policy confirmed and documentation issued in the format your visa application needs." },
      { step: "04", title: "Trip support", description: "Guidance available if you need to understand or initiate a claim while travelling." },
    ],
    faqs: [
      { question: "Do I need travel insurance for a study visa?", answer: "Many destinations require it. We confirm the specific requirement for your visa type before you purchase." },
      { question: "Does travel insurance cover medical emergencies abroad?", answer: "Most policies do, at varying levels — we walk you through what's included before you buy." },
      { question: "Can I get cover for an existing trip already booked?", answer: "In most cases yes, provided the trip hasn't already started." },
    ],
  },
  {
    slug: "scholarship-assistance",
    title: "Scholarship Assistance",
    routeCode: "MPG-SCH",
    routeFrom: "APPLY",
    routeTo: "AWARDED",
    tagline: "Real opportunities you qualify for, not a generic list.",
    summary:
      "Funding opportunities matched to your profile, with hands-on application support.",
    overview:
      "We help identify scholarship and funding opportunities matched to your academic profile and destination, and support the documentation and essay preparation that applications require — while being direct about where the odds genuinely stand.",
    benefits: [
      { title: "Matched opportunities", description: "Scholarships shortlisted against your actual academic profile and eligibility." },
      { title: "Application document support", description: "Personal statements and reference letters reviewed before submission." },
      { title: "Realistic odds, stated upfront", description: "We tell you where competition is genuinely high before you invest time applying." },
      { title: "Deadline tracking", description: "Multiple applications tracked so nothing is missed." },
    ],
    process: [
      { step: "01", title: "Profile assessment", description: "Academic record, destination and funding need reviewed together." },
      { step: "02", title: "Opportunity shortlist", description: "Scholarships matched to your eligibility, ranked by realistic fit." },
      { step: "03", title: "Application support", description: "Essays, references and forms reviewed before you submit." },
      { step: "04", title: "Tracking & follow-up", description: "Deadlines and decision timelines tracked across every application." },
    ],
    faqs: [
      { question: "Can you guarantee I'll receive a scholarship?", answer: "No — awards are decided by the institution or funding body. We can only guarantee a properly prepared application." },
      { question: "Is this only for study abroad scholarships?", answer: "Primarily, yes, though we can also flag relevant local funding opportunities where available." },
      { question: "Do you charge if my application isn't successful?", answer: "Fees are agreed upfront and cover the preparation work, not the outcome — this is explained clearly before you commit." },
    ],
  },
  {
    slug: "travel-loans",
    title: "Travel Loans",
    routeCode: "MPG-TLN",
    routeFrom: "NEED",
    routeTo: "FUNDED",
    tagline: "Structured financing so timing doesn't derail your trip.",
    summary:
      "Structured financing for flights, visas and relocation costs.",
    overview:
      "We connect qualified clients with structured travel financing options and help prepare the documentation lenders require, so travel plans aren't held up by cash flow timing.",
    benefits: [
      { title: "Structured lender introductions", description: "Matched to options relevant for travel-specific financing needs." },
      { title: "Documentation prepared properly", description: "Paperwork built to what lenders actually require, reducing delay." },
      { title: "Realistic terms explained upfront", description: "Costs and repayment terms laid out clearly before you apply." },
      { title: "Timeline coordination", description: "Financing timed against your actual travel or visa deadline." },
    ],
    process: [
      { step: "01", title: "Needs assessment", description: "We confirm what's being financed and the required timeline." },
      { step: "02", title: "Lender matching", description: "Suitable financing options identified for your situation." },
      { step: "03", title: "Documentation", description: "Application paperwork prepared and checked before submission." },
      { step: "04", title: "Disbursement coordination", description: "Funding timed against your booking or visa deadline." },
    ],
    faqs: [
      { question: "Do you lend the money directly?", answer: "No — we connect qualified clients with structured lending partners and support the application process." },
      { question: "What can travel financing be used for?", answer: "Typically flights, visa fees and related relocation costs, depending on the lender's terms." },
      { question: "How long does approval take?", answer: "It varies by lender, but we help build the application to avoid unnecessary delay on your side." },
    ],
  },
  {
    slug: "education-loans",
    title: "Education Loans",
    routeCode: "MPG-EDL",
    routeFrom: "TUITION",
    routeTo: "FUNDED",
    tagline: "Funding structured around tuition and visa financial proof, together.",
    summary:
      "Tuition financing coordinated with your visa's financial proof requirements.",
    overview:
      "We help prospective international students explore education financing options and prepare the documentation required both by lenders and by the visa application itself, so funding proof and loan approval move on the same timeline.",
    benefits: [
      { title: "Financing matched to tuition needs", description: "Options identified against your specific institution and programme cost." },
      { title: "Visa-ready financial documentation", description: "Paperwork built to satisfy both the lender and your visa's financial proof requirement." },
      { title: "Timeline coordination", description: "Loan approval sequenced against admission and visa deadlines." },
      { title: "Realistic terms explained upfront", description: "Repayment terms and total cost laid out clearly before you commit." },
    ],
    process: [
      { step: "01", title: "Funding assessment", description: "Tuition cost, timeline and existing funding sources reviewed." },
      { step: "02", title: "Lender matching", description: "Education-financing options identified for your programme and destination." },
      { step: "03", title: "Documentation", description: "Application and financial-proof paperwork prepared together." },
      { step: "04", title: "Approval & disbursement", description: "Funding timed to meet both tuition deadlines and visa requirements." },
    ],
    faqs: [
      { question: "Can this financial proof be used directly for my study visa?", answer: "In most cases, yes — we prepare documentation to satisfy both the lender and the visa's financial requirement." },
      { question: "Do you finance the loans yourselves?", answer: "No — we connect qualified applicants with lending partners and manage the documentation process." },
      { question: "What if my admission offer is conditional?", answer: "We coordinate financing timing around conditional offers, since many lenders require confirmed admission first." },
    ],
  },
  {
    slug: "corporate-travel",
    title: "Corporate Travel",
    routeCode: "MPG-CTR",
    routeFrom: "TEAM",
    routeTo: "DEPLOYED",
    tagline: "Multi-traveller logistics managed by one dedicated contact, not a portal.",
    summary:
      "Managed flights, stays and logistics for business travellers and teams.",
    overview:
      "We manage flights, accommodation and itinerary logistics for business travel and teams, consolidating bookings under one point of contact so travel coordinators aren't juggling multiple platforms and vendors.",
    benefits: [
      { title: "Single point of contact", description: "One representative coordinating flights, stays and changes across your whole team." },
      { title: "Consolidated billing", description: "Bookings structured for straightforward expense reconciliation." },
      { title: "Policy-aware booking", description: "Reservations made within your organisation's travel policy and budget bands." },
      { title: "Priority change support", description: "Faster handling for time-sensitive business travel disruptions." },
    ],
    process: [
      { step: "01", title: "Travel policy review", description: "We align on your organisation's budget bands and approval process." },
      { step: "02", title: "Booking coordination", description: "Flights and stays booked and confirmed across your travelling team." },
      { step: "03", title: "Itinerary distribution", description: "Confirmed itineraries shared with travellers and coordinators together." },
      { step: "04", title: "Ongoing support", description: "One contact for changes, disruptions and future trip requests." },
    ],
    faqs: [
      { question: "Do you work with a minimum number of travellers?", answer: "No — we support single business trips as well as recurring team travel." },
      { question: "Can you bill our company directly?", answer: "Billing arrangements are agreed upfront based on your organisation's preferred process." },
      { question: "Can you manage travel for a recurring schedule, not just one trip?", answer: "Yes — many corporate clients use us as an ongoing travel coordination point rather than a one-off booking service." },
    ],
  },
  {
    slug: "business-registration",
    title: "Business Registration Services",
    routeCode: "MPG-BRG",
    routeFrom: "IDEA",
    routeTo: "REGISTERED",
    tagline: "Company incorporation and regulatory registration, done correctly the first time.",
    summary:
      "Company name reservation, incorporation and regulatory registration for new businesses.",
    overview:
      "We manage company name reservation, incorporation, and regulatory registration for new businesses, keeping founders focused on building rather than paperwork.",
    benefits: [
      { title: "Name reservation handled first", description: "We confirm and reserve your business name before any other paperwork begins." },
      { title: "Complete incorporation filing", description: "Registration documents prepared and filed against current regulatory requirements." },
      { title: "Compliance documentation", description: "The certificates and filings your business needs to operate and open accounts." },
      { title: "Ongoing regulatory guidance", description: "Support understanding what filings and renewals come next after registration." },
    ],
    process: [
      { step: "01", title: "Name check & reservation", description: "We confirm availability and reserve your preferred business name." },
      { step: "02", title: "Documentation", description: "Incorporation paperwork prepared and reviewed with you before filing." },
      { step: "03", title: "Filing & registration", description: "Application submitted to the relevant regulatory body." },
      { step: "04", title: "Certificate & next steps", description: "Registration certificate delivered, with guidance on immediate compliance needs." },
    ],
    faqs: [
      { question: "How long does business registration take?", answer: "It varies by business structure, but we give you a realistic timeline once your documentation is confirmed." },
      { question: "Can you register a business if I'm not resident locally?", answer: "In many cases yes — tell us your situation and we'll confirm what's possible before you commit to anything." },
      { question: "Do you handle post-registration compliance too?", answer: "We can guide you on what's required next, though ongoing compliance filing is agreed as a separate scope." },
    ],
  },
];
