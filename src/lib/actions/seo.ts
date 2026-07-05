"use server";

import { requireAdmin } from "@/lib/actions/require-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  page: z.enum(["home", "about", "services", "contact"]),
  metaTitle: z.string().min(2),
  metaDescription: z.string().min(2),
  keywords: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export async function updateSeoSetting(formData: FormData) {
  await requireAdmin();
  const data = schema.parse({
    page: formData.get("page"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    keywords: formData.get("keywords") || undefined,
    ogImageUrl: formData.get("ogImageUrl") || undefined,
  });

  await prisma.seoSetting.upsert({
    where: { page: data.page },
    update: data,
    create: data,
  });

  revalidatePath("/admin/seo");
  revalidatePath(`/${data.page === "home" ? "" : data.page}`);
}
