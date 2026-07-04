"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().email();

export type SubscribeResult = { success: boolean; message: string };

export async function subscribeToNewsletter(
  _prevState: SubscribeResult | null,
  formData: FormData
): Promise<SubscribeResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { success: false, message: "Enter a valid email address." };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      update: {},
      create: { email: parsed.data },
    });
    revalidatePath("/admin/newsletter");
    return { success: true, message: "You're subscribed." };
  } catch (error) {
    console.error("[newsletter] failed to subscribe:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function deleteSubscriber(id: string) {
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
