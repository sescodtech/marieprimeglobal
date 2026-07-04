import { prisma } from "@/lib/prisma";
import { siteContent as staticContent } from "@/lib/data";

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
