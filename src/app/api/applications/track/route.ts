import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { referenceNumber?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const referenceNumber = body.referenceNumber?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!referenceNumber || !email) {
    return NextResponse.json({ error: "Enter your reference number and email address." }, { status: 400 });
  }

  const application = await prisma.serviceApplication.findUnique({
    where: { referenceNumber },
    include: {
      statusHistory: { orderBy: { createdAt: "asc" } },
      notes: { where: { isPublic: true }, orderBy: { createdAt: "desc" } },
    },
  });

  // Deliberately vague on mismatch (don't reveal whether the reference
  // number exists but the email doesn't match, or vice versa).
  if (!application || application.applicantEmail.toLowerCase() !== email) {
    return NextResponse.json(
      { error: "We couldn't find an application matching that reference number and email address." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    referenceNumber: application.referenceNumber,
    serviceTitle: application.serviceTitle,
    status: application.status,
    submittedAt: application.submittedAt,
    updatedAt: application.updatedAt,
    timeline: application.statusHistory.map((event) => ({
      status: event.status,
      note: event.note,
      createdAt: event.createdAt,
    })),
    publicNotes: application.notes.map((note) => ({ body: note.body, createdAt: note.createdAt })),
  });
}
