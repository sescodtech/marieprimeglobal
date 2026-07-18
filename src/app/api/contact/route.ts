import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEnquiryNotification, sendEnquiryConfirmationEmail } from "@/lib/email";
import { notifyAdminsWithPermission } from "@/lib/notifications";
import { PERMISSIONS } from "@/lib/permissions";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  serviceInterest: z.enum([
    "STUDY_ABROAD",
    "VISA_IMMIGRATION",
    "TRAVEL_PACKAGES",
    "FLIGHT_BOOKING",
    "HOTEL_RESERVATION",
    "TRAVEL_INSURANCE",
    "SCHOLARSHIP_ASSISTANCE",
    "TRAVEL_LOAN",
    "EDUCATION_LOAN",
    "CORPORATE_TRAVEL",
    "BUSINESS_REGISTRATION",
    "GENERAL_ENQUIRY",
  ]),
  subject: z.string().min(2).max(200).optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: parsed.data,
    });

    // Fire-and-forget: don't let a slow/failed email delay the response to
    // the person submitting the form. The enquiry is already saved and
    // visible in the admin dashboard regardless of email outcome.
    void sendEnquiryNotification(enquiry);
    void sendEnquiryConfirmationEmail(enquiry);
    void notifyAdminsWithPermission(PERMISSIONS.MANAGE_ENQUIRIES, {
      title: "New enquiry received",
      body: `${enquiry.fullName} submitted a new enquiry${enquiry.subject ? `: ${enquiry.subject}` : "."}`,
      link: `/admin/enquiries/${enquiry.id}`,
      category: "ENQUIRIES",
    });

    return NextResponse.json({ id: enquiry.id }, { status: 201 });
  } catch (error) {
    console.error("[contact] failed to save enquiry:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
