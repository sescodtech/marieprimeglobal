"use server";

import { requireAdmin } from "@/lib/actions/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const blogPostSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  category: z.string().min(2),
  title: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().optional(),
  readTime: z.string().min(2),
  publishedLabel: z.string().min(2),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean(),
  order: z.coerce.number().default(0),
});

function parseFormData(formData: FormData) {
  return blogPostSchema.parse({
    slug: formData.get("slug"),
    category: formData.get("category"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content") || undefined,
    readTime: formData.get("readTime"),
    publishedLabel: formData.get("publishedLabel"),
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const data = parseFormData(formData);
  await prisma.blogPost.create({ data });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseFormData(formData);
  await prisma.blogPost.update({ where: { id }, data });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  "use server";
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
}

export async function toggleBlogPostPublished(id: string, isPublished: boolean) {
  "use server";
  await requireAdmin();
  await prisma.blogPost.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
}
