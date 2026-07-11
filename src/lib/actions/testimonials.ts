"use server";

import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const testimonialSchema = z.object({
  clientName: z.string().min(2),
  clientRole: z.string().optional(),
  quote: z.string().min(10),
  photoUrl: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).default(5),
  isPublished: z.boolean(),
  order: z.coerce.number().default(0),
});

function parseFormData(formData: FormData) {
  return testimonialSchema.parse({
    clientName: formData.get("clientName"),
    clientRole: formData.get("clientRole") || undefined,
    quote: formData.get("quote"),
    photoUrl: formData.get("photoUrl") || undefined,
    rating: formData.get("rating") || 5,
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createTestimonial(formData: FormData) {
  await requirePermission(PERMISSIONS.MANAGE_TESTIMONIALS);
  const data = parseFormData(formData);
  await prisma.testimonial.create({ data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requirePermission(PERMISSIONS.MANAGE_TESTIMONIALS);
  const data = parseFormData(formData);
  await prisma.testimonial.update({ where: { id }, data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  "use server";
  await requirePermission(PERMISSIONS.MANAGE_TESTIMONIALS);
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialPublished(id: string, isPublished: boolean) {
  "use server";
  await requirePermission(PERMISSIONS.MANAGE_TESTIMONIALS);
  await prisma.testimonial.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
