// ---------------------------------------------------------------------------
// Static legal copy for /privacy-policy and /terms-and-conditions.
// Drafted as professional starter policies for MariePrime Global Services
// (travel, immigration and business-support services). Review with legal
// counsel before relying on this as your final published policy — update the
// company details, jurisdiction, and any service-specific clauses as needed.
// ---------------------------------------------------------------------------

export type LegalSection = {
  id: string;
  heading: string;
  body: string[];
  list?: string[];
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const privacyPolicyContent: LegalPageContent = {
  eyebrow: "Privacy Policy",
  title: "How we handle your information.",
  lastUpdated: "4 July 2026",
  intro:
    "MariePrime Global Services (\"MariePrime\", \"we\", \"us\", or \"our\") provides visa and travel assistance, flight and hotel bookings, travel insurance, event coordination, beauty services, procurement and logistics support. This Privacy Policy explains what personal information we collect, how we use it, and the choices available to you when you use our website or engage our services.",
  sections: [
    {
      id: "information-we-collect",
      heading: "1. Information We Collect",
      body: [
        "We collect information you provide directly to us, information generated as part of delivering a service, and limited technical information collected automatically when you use our website.",
      ],
      list: [
        "Identity and contact details — name, email address, phone number, postal or office address.",
        "Travel and immigration details — passport information, visa history, travel itineraries, and supporting documents you submit for a specific service.",
        "Payment information — billing details processed through our payment partners; MariePrime does not store full card numbers.",
        "Enquiry and communication records — messages sent through our contact forms, WhatsApp, email, or phone.",
        "Technical data — IP address, browser type, device information, and pages visited, collected via standard web analytics.",
      ],
    },
    {
      id: "how-we-use-information",
      heading: "2. How We Use Your Information",
      body: ["We use the information we collect to:"],
      list: [
        "Deliver the specific service you have requested, such as visa processing, flight booking, or logistics coordination.",
        "Communicate with you about enquiries, bookings, applications, and service updates.",
        "Process payments and maintain accurate financial and service records.",
        "Improve our website, services, and customer support based on usage patterns.",
        "Meet legal, regulatory, and immigration-authority requirements relevant to the service provided.",
        "Send newsletters or promotional updates, but only where you have opted in and you may unsubscribe at any time.",
      ],
    },
    {
      id: "sharing-disclosure",
      heading: "3. Sharing & Disclosure",
      body: [
        "We do not sell personal information. We share information only where necessary to deliver a service or where required by law, including with:",
      ],
      list: [
        "Airlines, hotels, insurers, and other travel-industry partners required to fulfil a booking.",
        "Government, embassy, and immigration authorities where required to process a visa or travel-document application.",
        "Payment processors and banking partners for the purpose of completing transactions.",
        "Professional advisors (legal, accounting) where necessary for compliance or dispute resolution.",
        "Regulators or law-enforcement bodies where disclosure is required by applicable law.",
      ],
    },
    {
      id: "data-retention",
      heading: "4. Data Retention",
      body: [
        "We retain personal information for as long as necessary to provide the service you requested, comply with legal and regulatory obligations (including immigration and financial record-keeping requirements), resolve disputes, and enforce our agreements. Documents submitted for a specific visa or travel application are retained only for the period required to complete that application and any statutory retention period thereafter, after which they are securely deleted or anonymised.",
      ],
    },
    {
      id: "cookies-tracking",
      heading: "5. Cookies & Tracking",
      body: [
        "Our website uses cookies and similar technologies to keep the site functional, remember your preferences, and understand how visitors use our pages. You can control or disable cookies through your browser settings; doing so may affect certain features of the website.",
      ],
    },
    {
      id: "data-security",
      heading: "6. Data Security",
      body: [
        "We apply reasonable administrative, technical, and physical safeguards to protect personal information against unauthorised access, alteration, or disclosure. Documents involving travel and immigration data are handled by authorised personnel only and shared with third parties strictly on a need-to-know basis. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      id: "your-rights",
      heading: "7. Your Rights",
      body: [
        "Depending on your location, you may have the right to access, correct, update, or request deletion of your personal information, object to certain processing, and withdraw consent where processing is based on consent. To exercise any of these rights, contact us using the details at the end of this policy — we will respond within a reasonable timeframe.",
      ],
    },
    {
      id: "childrens-privacy",
      heading: "8. Children's Privacy",
      body: [
        "Our services are intended for individuals who are at least 18 years old, or minors travelling under the supervision and documented consent of a parent or legal guardian who submits the required information on their behalf. We do not knowingly collect personal information directly from unsupervised minors.",
      ],
    },
    {
      id: "third-party-links",
      heading: "9. Third-Party Links",
      body: [
        "Our website may link to third-party websites, such as airline or hotel booking portals. We are not responsible for the privacy practices or content of third-party sites, and we encourage you to review their respective privacy policies.",
      ],
    },
    {
      id: "changes-to-policy",
      heading: "10. Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The \"Last updated\" date at the top of this page indicates when this policy was last revised. Continued use of our website or services after an update constitutes acceptance of the revised policy.",
      ],
    },
    {
      id: "contact-us",
      heading: "11. Contact Us",
      body: [
        "If you have questions about this Privacy Policy or how we handle your information, please reach out using the contact details listed on our Contact page or in the footer of this website.",
      ],
    },
  ],
};

export const termsAndConditionsContent: LegalPageContent = {
  eyebrow: "Terms & Conditions",
  title: "The terms behind every engagement.",
  lastUpdated: "4 July 2026",
  intro:
    "These Terms & Conditions (\"Terms\") govern your access to and use of the MariePrime Global Services website and any service booked, requested, or delivered through us, including visa and travel assistance, flight and hotel bookings, travel insurance, event coordination, beauty services, procurement, and logistics. By using our website or engaging our services, you agree to these Terms.",
  sections: [
    {
      id: "acceptance-of-terms",
      heading: "1. Acceptance of Terms",
      body: [
        "By accessing our website, submitting an enquiry, or engaging any MariePrime service, you confirm that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy. If you do not agree with any part of these Terms, please do not use our website or services.",
      ],
    },
    {
      id: "description-of-services",
      heading: "2. Description of Services",
      body: [
        "MariePrime acts as a service provider and, in some cases, an intermediary between clients and third parties such as airlines, hotels, insurers, and government or embassy bodies. While we manage applications and bookings with diligence and care, certain outcomes — particularly visa approvals — are determined solely by the relevant government or embassy authority and are outside our control.",
      ],
    },
    {
      id: "eligibility-account",
      heading: "3. Eligibility & Client Responsibility",
      body: [
        "You must provide accurate, complete, and current information when engaging our services, including all documents required to process a booking or application. You are responsible for the accuracy of the information you submit, and MariePrime is not liable for delays, rejections, or losses resulting from incomplete or inaccurate information provided by you.",
      ],
    },
    {
      id: "bookings-payments-fees",
      heading: "4. Bookings, Payments & Fees",
      body: [
        "Service fees, third-party costs (such as flight fares, hotel rates, or embassy charges), and payment schedules will be communicated before a booking or application is confirmed. Full or partial payment may be required upfront depending on the service. Prices for flights, hotels, and other third-party bookings are subject to availability and may change until payment is confirmed.",
      ],
    },
    {
      id: "visa-immigration-disclaimer",
      heading: "5. Visa & Immigration Disclaimer",
      body: [
        "MariePrime provides guidance, documentation support, and application processing assistance for visa and immigration matters. We do not guarantee visa approval, entry clearance, or any specific immigration outcome, as these decisions rest entirely with the relevant embassy, consulate, or government authority. Our service fee covers the professional assistance provided and is separate from any government or third-party fee, which is typically non-refundable regardless of outcome.",
      ],
    },
    {
      id: "cancellations-refunds",
      heading: "6. Cancellations & Refunds",
      body: [
        "Cancellation and refund terms vary by service and will be communicated at the time of booking. In general, third-party costs already paid to airlines, hotels, insurers, or government bodies are subject to that third party's own cancellation and refund policy. MariePrime service fees for work already performed (such as document review, application preparation, or processing already submitted) are generally non-refundable.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "7. Intellectual Property",
      body: [
        "All content on this website, including text, graphics, logos, and design, is the property of MariePrime Global Services or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without prior written consent.",
      ],
    },
    {
      id: "user-conduct",
      heading: "8. Client Conduct",
      body: [
        "You agree not to use our website or services for any unlawful purpose, to submit fraudulent documentation, or to misrepresent your identity or circumstances. MariePrime reserves the right to decline, pause, or terminate a service where we reasonably suspect misuse, fraud, or a breach of these Terms.",
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "9. Limitation of Liability",
      body: [
        "To the fullest extent permitted by law, MariePrime shall not be liable for indirect, incidental, or consequential losses, including missed flights, denied entry, visa refusal, or losses arising from third-party actions (airlines, hotels, insurers, embassies) beyond our control. Our total liability for any claim arising from a service is limited to the service fee paid to MariePrime for that specific engagement.",
      ],
    },
    {
      id: "indemnification",
      heading: "10. Indemnification",
      body: [
        "You agree to indemnify and hold MariePrime harmless from any claims, losses, or expenses arising from your breach of these Terms, misuse of our services, or the provision of inaccurate or fraudulent information.",
      ],
    },
    {
      id: "governing-law",
      heading: "11. Governing Law",
      body: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles. Any dispute arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria, unless otherwise required by applicable law.",
      ],
    },
    {
      id: "changes-to-terms",
      heading: "12. Changes to These Terms",
      body: [
        "We may revise these Terms from time to time. The \"Last updated\" date at the top of this page reflects the most recent revision. Continued use of our website or services after changes take effect constitutes your acceptance of the revised Terms.",
      ],
    },
    {
      id: "contact-us",
      heading: "13. Contact Us",
      body: [
        "For questions about these Terms & Conditions, please reach out using the contact details listed on our Contact page or in the footer of this website.",
      ],
    },
  ],
};
