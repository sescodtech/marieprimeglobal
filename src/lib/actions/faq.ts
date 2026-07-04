"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const faqSchema = z.object({
  category: z.string().min(2),
  question: z.string().min(5),
  answer: z.string().min(10),
  isPublished: z.boolean(),
  order: z.coerce.number().default(0),
});

function parseFormData(formData: FormData) {
  return faqSchema.parse({
    category: formData.get("category"),
    question: formData.get("question"),
    answer: formData.get("answer"),
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createFaq(formData: FormData) {
  const data = parseFormData(formData);
  await prisma.faq.create({ data });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

export async function updateFaq(id: string, formData: FormData) {
  const data = parseFormData(formData);
  await prisma.faq.update({ where: { id }, data });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

export async function deleteFaq(id: string) {
  "use server";
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidatePath("/");
}

export async function toggleFaqPublished(id: string, isPublished: boolean) {
  "use server";
  await prisma.faq.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidatePath("/");
}
