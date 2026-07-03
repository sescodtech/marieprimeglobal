import { prisma } from "@/lib/prisma";
import { siteContent as staticContent } from "@/lib/data";
import { cloudinary } from "@/lib/cloudinary";

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

export async function getSeoSetting(page: "home" | "about" | "services" | "contact") {
  return prisma.seoSetting.findUnique({ where: { page } });
}

export async function getHomeHero() {
  const map = await getSiteSettingsMap();
  const publicId = (map.get("hero_image") as string) || staticContent.home.heroImagePublicId;
  const heroImageUrl =
    publicId && typeof publicId === "string"
      ? cloudinary.url(publicId, {
          width: 2000,
          height: 1200,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
        })
      : null;

  return {
    heroEyebrow: (map.get("hero_eyebrow") as string) || staticContent.home.heroEyebrow,
    heroHeadline: (map.get("hero_headline") as string) || staticContent.home.heroHeadline,
    heroSubtext: (map.get("hero_subtext") as string) || staticContent.home.heroSubtext,
    heroImageUrl,
  };
}
