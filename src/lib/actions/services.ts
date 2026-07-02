"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const serviceSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(2),
  routeCode: z.string().min(2),
  routeFrom: z.string().min(1),
  routeTo: z.string().min(1),
  summary: z.string().min(5),
  description: z.string().min(10),
  imageUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean(),
  order: z.coerce.number().default(0),
});

function parseFormData(formData: FormData) {
  return serviceSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    routeCode: formData.get("routeCode"),
    routeFrom: formData.get("routeFrom"),
    routeTo: formData.get("routeTo"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createService(formData: FormData) {
  const data = parseFormData(formData);
  await prisma.service.create({ data });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  const data = parseFormData(formData);
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  "use server";
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function toggleServicePublished(id: string, isPublished: boolean) {
  "use server";
  await prisma.service.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}
