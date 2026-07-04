import { prisma } from "@/lib/prisma";
import { siteContent as staticContent, defaultHomeServices } from "@/lib/data";

export type HomeServiceCard = {
  slug: string;
  title: string;
  summary: string;
  icon: string | null;
  href: string;
};

/**
 * Services shown in the homepage "What We Offer" section.
 * If the Admin has published Service records, those are used and take
 * priority automatically. Only when none exist yet do we fall back to the
 * default service catalogue — this fallback disappears the moment an admin
 * adds and publishes services in /admin/services.
 */
export async function getHomeServices(): Promise<HomeServiceCard[]> {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  if (services.length > 0) {
    return services.map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      icon: s.icon,
      href: `/services/${s.slug}`,
    }));
  }

  return defaultHomeServices.map((s) => ({
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    icon: s.icon,
    href: `/contact?service=${s.slug}`,
  }));
}

export async function getSiteSettingsMap() {
  const rows = await prisma.siteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return map;
}

export async function getContactInfo() {
  const map = await getSiteSettingsMap();
  return {
    email: map.get("contact_email") || staticContent.contact.email,
    phone: map.get("contact_phone") || staticContent.contact.phone,
    whatsapp: map.get("contact_whatsapp") || staticContent.contact.whatsapp,
    address: map.get("contact_address") || staticContent.contact.address,
    workingHours: staticContent.contact.workingHours,
    socials: {
      instagram: map.get("social_instagram") || staticContent.contact.socials.instagram,
      linkedin: map.get("social_linkedin") || staticContent.contact.socials.linkedin,
      facebook: map.get("social_facebook") || staticContent.contact.socials.facebook,
    },
  };
}

export async function getSeoSetting(page: "home" | "about" | "services" | "contact" | "blog" | "careers" | "faq") {
  return prisma.seoSetting.findUnique({ where: { page } });
}

export async function getHomeHero() {
  const map = await getSiteSettingsMap();
  return {
    heroEyebrow: map.get("hero_eyebrow") || staticContent.home.heroEyebrow,
    heroHeadline: map.get("hero_headline") || staticContent.home.heroHeadline,
    heroSubtext: map.get("hero_subtext") || staticContent.home.heroSubtext,
  };
}
