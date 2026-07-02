"use server";

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
  hero_eyebrow: "home_hero",
  hero_headline: "home_hero",
  hero_subtext: "home_hero",
};

export async function updateSiteSettings(formData: FormData) {
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
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
}
