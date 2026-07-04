import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { siteContent } from "@/lib/data";
import { getContactInfo } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteContent.brand.name} | ${siteContent.brand.tagline}`,
    template: `%s | ${siteContent.brand.shortName}`,
  },
  description:
    "MariePrime Global Services manages flight booking, visa and immigration assistance, travel loans, study abroad support, business registration and investment advisory.",
  keywords: [
    "MariePrime",
    "visa assistance Nigeria",
    "flight booking agency",
    "study abroad consultant",
    "business registration Nigeria",
    "travel loan assistance",
    "immigration consultant Lagos",
  ],
  openGraph: {
    type: "website",
    siteName: siteContent.brand.name,
    title: siteContent.brand.name,
    description: siteContent.brand.tagline,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.brand.name,
    description: siteContent.brand.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const contact = await getContactInfo();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteContent.brand.name,
    alternateName: siteContent.brand.shortName,
    description:
      "MariePrime Global Services manages flight booking, visa and immigration assistance, travel loans, study abroad support, business registration and investment advisory.",
    url: siteUrl,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressCountry: "NG",
    },
    sameAs: [contact.socials.instagram, contact.socials.linkedin, contact.socials.facebook].filter(
      Boolean
    ),
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="font-body">
        <Header whatsapp={contact.whatsapp} />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp whatsapp={contact.whatsapp} />
      </body>
    </html>
  );
}
