import type { Metadata } from "next";
import { getSeoSetting, getGlobalSeoSettings } from "@/lib/content";

type SeoPageKey = "home" | "about" | "services" | "visa" | "contact" | "blog" | "careers" | "faq";

/**
 * Builds a page's <Metadata> from its SeoSetting row (if a Super Admin has
 * configured one) layered over the Global SEO fallback, then over the
 * hardcoded default passed in. Every layer is optional — nothing here ever
 * throws if SEO hasn't been configured yet.
 */
export async function buildPageMetadata(
  page: SeoPageKey,
  fallback: { title: string; description: string },
  path: string
): Promise<Metadata> {
  const [pageSeo, globalSeo] = await Promise.all([getSeoSetting(page), getGlobalSeoSettings()]);

  const title = pageSeo?.metaTitle || fallback.title;
  const description = pageSeo?.metaDescription || globalSeo.metaDescription || fallback.description;
  const canonical = pageSeo?.canonicalUrl || (globalSeo.canonicalUrl ? `${globalSeo.canonicalUrl}${path}` : path);
  const ogImage = pageSeo?.ogImageUrl || globalSeo.ogImageUrl || undefined;
  const twitterImage = pageSeo?.twitterImageUrl || globalSeo.twitterImageUrl || ogImage;
  const keywords = pageSeo?.keywords || globalSeo.keywords || undefined;

  return {
    title,
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical },
    robots: {
      index: !(pageSeo?.noIndex ?? false),
      follow: !(pageSeo?.noFollow ?? false),
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImage ? [twitterImage] : undefined,
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
