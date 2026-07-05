"use server";

import { requireAdmin } from "@/lib/actions/require-admin";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const SETTINGS_MAP: Record<string, string> = {
  contact_email: "contact",
  contact_phone: "contact",
  contact_whatsapp: "contact",
  contact_address: "contact",
  social_instagram: "social",
  social_linkedin: "social",
  social_facebook: "social",
  social_tiktok: "social",
  hero_eyebrow: "home_hero",
  hero_headline: "home_hero",
  hero_subtext: "home_hero",
  site_logo_url: "brand",
};

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
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

  revalidatePath("/admin/settings");
  // Header/Footer live in the root layout and render the logo + contact info
  // on every route, so invalidate the whole layout rather than page-by-page.
  revalidatePath("/", "layout");
}
