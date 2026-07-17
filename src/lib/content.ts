import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { siteContent as staticContent, defaultHomeServices } from "@/lib/data";

const MANUAL_LOGO_DIR = path.join(process.cwd(), "public", "images", "logo");
const MANUAL_LOGO_EXTENSIONS = new Set(["png", "svg", "webp", "jpg", "jpeg"]);

/**
 * Fallback logo source: drop a file into public/images/logo/ and it's picked
 * up automatically — no code changes or redeploy of Admin settings needed.
 * If several files are present, the most recently modified one wins, so
 * simply replacing the file "just works" as the new logo.
 */
function findManualLogo(): string | null {
  try {
    if (!fs.existsSync(MANUAL_LOGO_DIR)) return null;
    const candidates = fs
      .readdirSync(MANUAL_LOGO_DIR)
      .filter((file) => MANUAL_LOGO_EXTENSIONS.has(file.split(".").pop()?.toLowerCase() ?? ""))
      .map((file) => ({
        file,
        mtime: fs.statSync(path.join(MANUAL_LOGO_DIR, file)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    return candidates.length > 0 ? `/images/logo/${candidates[0].file}` : null;
  } catch {
    return null;
  }
}

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
    companyName: map.get("company_name") || "MariePrime Global Services",
    email: map.get("contact_email") || staticContent.contact.email,
    phone: map.get("contact_phone") || staticContent.contact.phone,
    whatsapp: map.get("contact_whatsapp") || staticContent.contact.whatsapp,
    address: map.get("contact_address") || staticContent.contact.address,
    workingHours: map.get("working_hours") || staticContent.contact.workingHours,
    socials: {
      instagram: map.get("social_instagram") || staticContent.contact.socials.instagram,
      linkedin: map.get("social_linkedin") || staticContent.contact.socials.linkedin,
      facebook: map.get("social_facebook") || staticContent.contact.socials.facebook,
      tiktok: map.get("social_tiktok") || staticContent.contact.socials.tiktok,
      x: map.get("social_x") || "",
      youtube: map.get("social_youtube") || "",
    },
  };
}

export async function getBrandingSettings() {
  const map = await getSiteSettingsMap();
  return {
    logoUrl: map.get("site_logo_url") || "",
    darkLogoUrl: map.get("dark_logo_url") || "",
    faviconUrl: map.get("favicon_url") || "",
  };
}

export async function getEmailSettings() {
  const map = await getSiteSettingsMap();
  return {
    senderName: map.get("email_sender_name") || "MariePrime Global",
    replyTo: map.get("email_reply_to") || "",
    notificationEmail: map.get("email_notification_to") || process.env.NOTIFY_EMAIL_TO || "",
  };
}

export async function getUploadSettings() {
  const map = await getSiteSettingsMap();
  return {
    maxSizeMb: Number(map.get("upload_max_size_mb")) || 8,
    allowedTypes: map.get("upload_allowed_types") || "image/jpeg,image/png,application/pdf",
  };
}

export async function getSecuritySettings() {
  const map = await getSiteSettingsMap();
  return {
    sessionTimeoutMinutes: Number(map.get("security_session_timeout_minutes")) || 480,
    passwordMinLength: Number(map.get("security_password_min_length")) || 8,
  };
}

/** Website Form Control Center — global kill-switches for every service at
 *  once, independent of each service's own applicationMode. */
export async function getGlobalFormControls() {
  const map = await getSiteSettingsMap();
  return {
    applicationsEnabled: map.get("global_applications_enabled") !== "false",
    enquiriesEnabled: map.get("global_enquiries_enabled") !== "false",
  };
}

/**
 * Logo used across the site (Header, etc). Preference order:
 * 1. Admin Dashboard upload (Settings → Branding), stored in SiteSetting.
 * 2. A file manually dropped into public/images/logo/.
 * 3. null — the site falls back to the default boarding-pass mark.
 */
export async function getSiteLogo() {
  const map = await getSiteSettingsMap();
  const uploaded = map.get("site_logo_url");
  if (uploaded) return uploaded;
  return findManualLogo();
}

/** Just the Admin-uploaded logo (no folder fallback) — used to populate the settings form. */
export async function getSiteLogoSetting() {
  const map = await getSiteSettingsMap();
  return map.get("site_logo_url") || "";
}

export async function getSeoSetting(
  page: "home" | "about" | "services" | "visa" | "contact" | "blog" | "careers" | "faq"
) {
  return prisma.seoSetting.findUnique({ where: { page } });
}

export async function getGlobalSeoSettings() {
  const map = await getSiteSettingsMap();
  return {
    siteTitle: map.get("seo_site_title") || "MariePrime Global Services",
    metaDescription: map.get("seo_meta_description") || "",
    keywords: map.get("seo_keywords") || "",
    canonicalUrl: map.get("seo_canonical_url") || "",
    ogImageUrl: map.get("seo_og_image_url") || "",
    twitterImageUrl: map.get("seo_twitter_image_url") || "",
    googleVerification: map.get("seo_google_verification") || "",
    bingVerification: map.get("seo_bing_verification") || "",
    facebookVerification: map.get("seo_facebook_verification") || "",
    gaId: map.get("seo_ga_id") || "",
    gtmId: map.get("seo_gtm_id") || "",
    fbPixelId: map.get("seo_fb_pixel_id") || "",
  };
}

export async function getHomeHero() {
  const map = await getSiteSettingsMap();
  return {
    heroEyebrow: map.get("hero_eyebrow") || staticContent.home.heroEyebrow,
    heroHeadline: map.get("hero_headline") || staticContent.home.heroHeadline,
    heroSubtext: map.get("hero_subtext") || staticContent.home.heroSubtext,
  };
}
