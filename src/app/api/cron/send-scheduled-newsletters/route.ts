import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterBatch } from "@/lib/newsletterSender";

/**
 * Sends any SCHEDULED newsletter whose scheduledFor time has passed. This
 * route does the sending; something needs to *call* it on a schedule —
 * add a Vercel Cron entry (vercel.json) pointing here, e.g. every 5
 * minutes: { "crons": [{ "path": "/api/cron/send-scheduled-newsletters",
 * "schedule": "*\/5 * * * *" }] }. Without that cron configured, scheduling
 * a newsletter will save it as SCHEDULED but nothing will trigger the send.
 *
 * Protected by CRON_SECRET so it can't be triggered by anyone who finds the
 * URL — Vercel Cron sends this automatically when configured.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await prisma.newsletter.findMany({
    where: { status: "SCHEDULED", scheduledFor: { lte: new Date() } },
  });

  for (const newsletter of due) {
    await sendNewsletterBatch(newsletter.id);
  }

  return NextResponse.json({ sent: due.length });
}
