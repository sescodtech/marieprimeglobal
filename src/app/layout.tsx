import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Footer } from "@/components/layout/Footer";
import { siteContent } from "@/lib/data";
import { getContactInfo, getSiteLogo, getGlobalSeoSettings } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { PopupManager } from "@/components/popups/PopupManager";

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

export async function generateMetadata(): Promise<Metadata> {
  const globalSeo = await getGlobalSeoSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: globalSeo.siteTitle !== "MariePrime Global Services"
        ? globalSeo.siteTitle
        : `${siteContent.brand.name} | ${siteContent.brand.tagline}`,
      template: `%s | ${siteContent.brand.shortName}`,
    },
    description:
      globalSeo.metaDescription ||
      "MariePrime Global Services manages flight booking, visa and immigration assistance, travel loans, study abroad support, business registration and investment advisory.",
    keywords: globalSeo.keywords
      ? globalSeo.keywords.split(",").map((k) => k.trim())
      : [
          "MariePrime",
          "visa assistance Nigeria",
          "flight booking agency",
          "study abroad consultant",
          "business registration Nigeria",
          "travel loan assistance",
          "immigration consultant Lagos",
        ],
    alternates: { canonical: globalSeo.canonicalUrl || undefined },
    openGraph: {
      type: "website",
      siteName: siteContent.brand.name,
      title: siteContent.brand.name,
      description: siteContent.brand.tagline,
      url: siteUrl,
      images: globalSeo.ogImageUrl ? [{ url: globalSeo.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteContent.brand.name,
      description: siteContent.brand.tagline,
      images: globalSeo.twitterImageUrl ? [globalSeo.twitterImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: globalSeo.googleVerification || undefined,
      other: {
        ...(globalSeo.bingVerification ? { "msvalidate.01": globalSeo.bingVerification } : {}),
        ...(globalSeo.facebookVerification ? { "facebook-domain-verification": globalSeo.facebookVerification } : {}),
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const contact = await getContactInfo();
  const logoUrl = await getSiteLogo();
  const globalSeo = await getGlobalSeoSettings();

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
    sameAs: [
      contact.socials.instagram,
      contact.socials.linkedin,
      contact.socials.facebook,
      contact.socials.tiktok,
    ].filter(Boolean),
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
        {globalSeo.gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${globalSeo.gtmId}');`}
          </Script>
        )}
      </head>
      <body className="font-body">
        {globalSeo.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${globalSeo.gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${globalSeo.gaId}');`}
            </Script>
          </>
        )}
        {globalSeo.fbPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${globalSeo.fbPixelId}');fbq('track', 'PageView');`}
          </Script>
        )}
        <AnnouncementBar />
        <SiteChrome whatsapp={contact.whatsapp} logoUrl={logoUrl} footer={<Footer />}>
          {children}
        </SiteChrome>
        <PopupManager />
      </body>
    </html>
  );
}
