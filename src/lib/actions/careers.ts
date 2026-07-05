"use server";

import { requireAdmin } from "@/lib/actions/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const jobSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(2),
  department: z.string().min(2),
  location: z.string().min(2),
  type: z.string().min(2),
  summary: z.string().min(10),
  isPublished: z.boolean(),
  order: z.coerce.number().default(0),
});

function parseFormData(formData: FormData) {
  return jobSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    department: formData.get("department"),
    location: formData.get("location"),
    type: formData.get("type"),
    summary: formData.get("summary"),
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createJobListing(formData: FormData) {
  await requireAdmin();
  const data = parseFormData(formData);
  await prisma.jobListing.create({ data });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers");
}

export async function updateJobListing(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseFormData(formData);
  await prisma.jobListing.update({ where: { id }, data });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers");
}

export async function deleteJobListing(id: string) {
  "use server";
  await requireAdmin();
  await prisma.jobListing.delete({ where: { id } });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}

export async function toggleJobListingPublished(id: string, isPublished: boolean) {
  "use server";
  await requireAdmin();
  await prisma.jobListing.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}
