import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Trust } from "@/components/home/Trust";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { Stats } from "@/components/home/Stats";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { WhyChoose } from "@/components/home/WhyChoose";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQPreview } from "@/components/home/FAQPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getHomeHero, getSeoSetting } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("home");
  return {
    title: seo?.metaTitle ?? "MariePrime Global Services | Flights, Visas, Study Abroad & Business Registration",
    description:
      seo?.metaDescription ??
      "MariePrime Global Services manages flight booking, visa and immigration assistance, travel loans, study abroad support and business registration — handled with precision.",
    alternates: { canonical: "/" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function HomePage() {
  const hero = await getHomeHero();

  return (
    <>
      <Hero {...hero} />
      <Trust />
      <ServicesOverview />
      <Stats />
      <FeaturedDestinations />
      <WhyChoose />
      <ProcessTimeline />
      <Testimonials />
      <FAQPreview />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
