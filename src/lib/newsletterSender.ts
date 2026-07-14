import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getEmailTemplate, renderTemplate } from "@/lib/emailTemplates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends one newsletter to all (or a chosen subset of) SUBSCRIBED recipients.
 * Creates/reuses a NewsletterRecipient row per subscriber so each send
 * attempt is individually tracked as sent/failed — this is what "Track:
 * Sent, Failed, Pending" (Phase 3.5) actually means in the data model.
 *
 * Sends are done in small sequential batches rather than all at once, to
 * stay comfortably under Resend's rate limits without needing a queue.
 */
export async function sendNewsletterBatch(newsletterId: string, subscriberIds?: string[]) {
  const newsletter = await prisma.newsletter.findUnique({ where: { id: newsletterId } });
  if (!newsletter) return;

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: {
      status: "SUBSCRIBED",
      ...(subscriberIds && subscriberIds.length > 0 ? { id: { in: subscriberIds } } : {}),
    },
  });

  await prisma.newsletter.update({
    where: { id: newsletterId },
    data: { status: "SENDING", recipientCount: subscribers.length },
  });

  // Recipient rows: create if missing (first send) or reuse (retry).
  await Promise.all(
    subscribers.map((s) =>
      prisma.newsletterRecipient.upsert({
        where: { newsletterId_subscriberId: { newsletterId, subscriberId: s.id } },
        update: {},
        create: { newsletterId, subscriberId: s.id },
      })
    )
  );

  const template = await getEmailTemplate("NEWSLETTER");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";

  let sentCount = 0;
  let failedCount = 0;
  const BATCH_SIZE = 20;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (subscriber) => {
        const vars = {
          clientName: subscriber.name || "there",
          companyName: "MariePrime Global",
          subject: newsletter.subject,
          message: newsletter.message,
        };
        const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

        try {
          if (!resend) throw new Error("RESEND_API_KEY not configured");
          const subject = template ? renderTemplate(template.subject, vars) : newsletter.subject;
          const bodyHtml = template
            ? renderTemplate(template.bodyHtml, vars)
            : `<div style="font-family: sans-serif; max-width: 560px;">${newsletter.message}</div>`;

          await resend.emails.send({
            from: "MariePrime Global <notifications@marieprimeglobal.com>",
            to: subscriber.email,
            subject,
            html: `${bodyHtml}<p style="margin-top:24px; font-size:12px; color:#9ca3af;">
              <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a>
            </p>`,
          });

          await prisma.newsletterRecipient.update({
            where: { newsletterId_subscriberId: { newsletterId, subscriberId: subscriber.id } },
            data: { status: "SENT", sentAt: new Date() },
          });
          sentCount += 1;
        } catch (error) {
          await prisma.newsletterRecipient.update({
            where: { newsletterId_subscriberId: { newsletterId, subscriberId: subscriber.id } },
            data: { status: "FAILED", error: error instanceof Error ? error.message : "Unknown error" },
          });
          failedCount += 1;
        }
      })
    );
  }

  await prisma.newsletter.update({
    where: { id: newsletterId },
    data: {
      status: failedCount > 0 && sentCount === 0 ? "FAILED" : "SENT",
      sentAt: new Date(),
      sentCount,
      failedCount,
    },
  });
}
