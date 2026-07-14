"use server";

import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const SETTINGS_MAP: Record<string, string> = {
  company_name: "contact",
  contact_email: "contact",
  contact_phone: "contact",
  contact_whatsapp: "contact",
  contact_address: "contact",
  working_hours: "contact",
  social_instagram: "social",
  social_linkedin: "social",
  social_facebook: "social",
  social_tiktok: "social",
  social_x: "social",
  social_youtube: "social",
  hero_eyebrow: "home_hero",
  hero_headline: "home_hero",
  hero_subtext: "home_hero",
  site_logo_url: "brand",
  dark_logo_url: "brand",
  favicon_url: "brand",
  email_sender_name: "email",
  email_reply_to: "email",
  email_notification_to: "email",
  upload_max_size_mb: "upload",
  upload_allowed_types: "upload",
  security_session_timeout_minutes: "security",
  security_password_min_length: "security",
};

export async function updateSiteSettings(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SETTINGS);
  const entries = Object.keys(SETTINGS_MAP).map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
    group: SETTINGS_MAP[key],
  }));

  await Promise.all(
    entries.map((entry) =>
      prisma.siteSetting.upsert({
        where: { key: entry.key },
        update: { value: entry.value, group: entry.group },
        create: entry,
      })
    )
  );

  await logAudit({
    actor,
    action: "SETTINGS_UPDATED",
    entityType: "SiteSetting",
    description: `${actor.name} updated site settings.`,
  });

  revalidatePath("/admin/settings");
  // Header/Footer live in the root layout and render the logo + contact info
  // on every route, so invalidate the whole layout rather than page-by-page.
  revalidatePath("/", "layout");
}
