"use server";

import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const SEO_PAGE_KEYS = ["home", "about", "services", "visa", "contact", "blog", "careers", "faq"] as const;

const schema = z.object({
  page: z.enum(SEO_PAGE_KEYS),
  metaTitle: z.string().min(2),
  metaDescription: z.string().min(2),
  keywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  twitterImageUrl: z.string().optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
});

export async function updateSeoSetting(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SETTINGS);
  const data = schema.parse({
    page: formData.get("page"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    keywords: formData.get("keywords") || undefined,
    canonicalUrl: formData.get("canonicalUrl") || undefined,
    ogImageUrl: formData.get("ogImageUrl") || undefined,
    twitterImageUrl: formData.get("twitterImageUrl") || undefined,
    noIndex: formData.get("noIndex") === "on",
    noFollow: formData.get("noFollow") === "on",
  });

  await prisma.seoSetting.upsert({
    where: { page: data.page },
    update: data,
    create: data,
  });

  await logAudit({
    actor,
    action: "SEO_SETTINGS_UPDATED",
    entityType: "SeoSetting",
    entityId: data.page,
    description: `${actor.name} updated SEO settings for the "${data.page}" page.`,
  });

  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

const GLOBAL_SEO_MAP: Record<string, string> = {
  seo_site_title: "seo_global",
  seo_meta_description: "seo_global",
  seo_keywords: "seo_global",
  seo_canonical_url: "seo_global",
  seo_og_image_url: "seo_global",
  seo_twitter_image_url: "seo_global",
  seo_google_verification: "seo_global",
  seo_bing_verification: "seo_global",
  seo_facebook_verification: "seo_global",
  seo_ga_id: "seo_global",
  seo_gtm_id: "seo_global",
  seo_fb_pixel_id: "seo_global",
};

export async function updateGlobalSeoSettings(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SETTINGS);
  const entries = Object.keys(GLOBAL_SEO_MAP).map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
    group: GLOBAL_SEO_MAP[key],
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
    action: "SEO_SETTINGS_UPDATED",
    entityType: "SiteSetting",
    description: `${actor.name} updated global SEO settings.`,
  });

  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
}
