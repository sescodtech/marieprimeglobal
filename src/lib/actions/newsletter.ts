"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { sendNewsletterBatch } from "@/lib/newsletterSender";
import { notifyAdminsWithPermission } from "@/lib/notifications";

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
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: parsed.data } });
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      // Re-subscribing after a prior unsubscribe should reactivate them.
      update: { status: "SUBSCRIBED", unsubscribedAt: null },
      create: { email: parsed.data },
    });
    if (!existing) {
      void notifyAdminsWithPermission(PERMISSIONS.MANAGE_SUBSCRIBERS, {
        title: "New newsletter subscriber",
        body: parsed.data,
        link: "/admin/newsletter",
        category: "NEWSLETTER",
      });
    }
    revalidatePath("/admin/newsletter");
    return { success: true, message: "You're subscribed." };
  } catch (error) {
    console.error("[newsletter] failed to subscribe:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

/** Public, token-free unsubscribe — used from the link in newsletter
 *  footers. Looked up by email since that's what a "one-click unsubscribe"
 *  link naturally carries; not sensitive information to require by itself. */
export async function unsubscribeByEmail(email: string) {
  try {
    await prisma.newsletterSubscriber.updateMany({
      where: { email: email.toLowerCase() },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });
  } catch (error) {
    console.error("[newsletter] failed to unsubscribe:", error);
  }
}

export async function deleteSubscriber(id: string) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SUBSCRIBERS);
  await prisma.newsletterSubscriber.delete({ where: { id } });
  await logAudit({
    actor,
    action: "SUBSCRIBER_DELETED",
    entityType: "NewsletterSubscriber",
    entityId: id,
    description: `${actor.name} deleted a newsletter subscriber.`,
  });
  revalidatePath("/admin/newsletter");
}

export async function setSubscriberStatus(id: string, status: "SUBSCRIBED" | "UNSUBSCRIBED") {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SUBSCRIBERS);
  await prisma.newsletterSubscriber.update({
    where: { id },
    data: { status, unsubscribedAt: status === "UNSUBSCRIBED" ? new Date() : null },
  });
  await logAudit({
    actor,
    action: "SUBSCRIBER_STATUS_CHANGED",
    entityType: "NewsletterSubscriber",
    entityId: id,
    description: `${actor.name} set a subscriber's status to ${status}.`,
  });
  revalidatePath("/admin/newsletter");
}

/** Imports a CSV of "email,name" (header row optional, name column
 *  optional) — existing subscribers are left alone rather than overwritten,
 *  new ones are added as SUBSCRIBED. */
export async function importSubscribersCsv(_prevState: { error?: string; success?: string }, formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.MANAGE_SUBSCRIBERS);
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Please choose a CSV file." };

  const text = await file.text();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let imported = 0;
  let skipped = 0;
  for (const line of lines) {
    const [rawEmail, rawName] = line.split(",").map((c) => c?.trim().replace(/^"|"$/g, ""));
    const parsed = emailSchema.safeParse(rawEmail);
    if (!parsed.success) {
      skipped += 1;
      continue;
    }
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: parsed.data } });
    if (existing) {
      skipped += 1;
      continue;
    }
    await prisma.newsletterSubscriber.create({ data: { email: parsed.data, name: rawName || null } });
    imported += 1;
  }

  await logAudit({
    actor,
    action: "SUBSCRIBERS_IMPORTED",
    entityType: "NewsletterSubscriber",
    description: `${actor.name} imported ${imported} subscriber(s) from CSV (${skipped} skipped).`,
  });

  revalidatePath("/admin/newsletter");
  return { success: `Imported ${imported} subscriber(s). ${skipped} skipped (invalid or already existing).` };
}

const newsletterSchema = z.object({
  subject: z.string().trim().min(2, "Subject is required."),
  message: z.string().trim().min(10, "Message is required."),
});

export async function createNewsletterDraft(_prevState: { error?: string }, formData: FormData) {
  await requirePermission(PERMISSIONS.CREATE_NEWSLETTER);
  const parsed = newsletterSchema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const newsletter = await prisma.newsletter.create({
    data: { subject: parsed.data.subject, message: parsed.data.message },
  });

  revalidatePath("/admin/newsletter");
  return { error: undefined, id: newsletter.id };
}

export async function scheduleNewsletter(id: string, scheduledFor: string) {
  const actor = await requirePermission(PERMISSIONS.SEND_NEWSLETTER);
  const date = new Date(scheduledFor);
  if (Number.isNaN(date.getTime()) || date <= new Date()) {
    throw new Error("Choose a valid future date and time.");
  }

  await prisma.newsletter.update({ where: { id }, data: { status: "SCHEDULED", scheduledFor: date } });

  await logAudit({
    actor,
    action: "NEWSLETTER_SCHEDULED",
    entityType: "Newsletter",
    entityId: id,
    description: `${actor.name} scheduled a newsletter for ${date.toISOString()}.`,
  });

  revalidatePath("/admin/newsletter");
}

/** Sends now — to every active subscriber, or a specific selected set. */
export async function sendNewsletterNow(id: string, subscriberIds?: string[]) {
  const actor = await requirePermission(PERMISSIONS.SEND_NEWSLETTER);
  const newsletter = await prisma.newsletter.findUnique({ where: { id } });
  if (!newsletter) return;

  await sendNewsletterBatch(newsletter.id, subscriberIds);

  await logAudit({
    actor,
    action: "NEWSLETTER_SENT",
    entityType: "Newsletter",
    entityId: id,
    description: `${actor.name} sent the newsletter "${newsletter.subject}".`,
  });

  revalidatePath("/admin/newsletter");
}

export async function deleteNewsletterDraft(id: string) {
  await requirePermission(PERMISSIONS.CREATE_NEWSLETTER);
  await prisma.newsletter.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
