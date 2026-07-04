import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { privacyPolicyContent } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How MariePrime Global Services collects, uses, and protects your personal information across our travel, immigration, and business support services.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <LegalPageLayout content={privacyPolicyContent} />;
}
