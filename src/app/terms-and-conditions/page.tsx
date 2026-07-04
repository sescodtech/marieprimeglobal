import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { termsAndConditionsContent } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of the MariePrime Global Services website and any visa, travel, insurance, procurement, or logistics service booked with us.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return <LegalPageLayout content={termsAndConditionsContent} />;
}
