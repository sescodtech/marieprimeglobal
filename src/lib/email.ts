import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const serviceLabels: Record<string, string> = {
  FLIGHT_BOOKING: "Flight Booking & Travel Solutions",
  VISA_IMMIGRATION: "Visa & Immigration Assistance",
  TRAVEL_LOAN: "Travel Loan Assistance",
  STUDY_ABROAD: "Study Abroad Support",
  BUSINESS_REGISTRATION: "Business Registration Services",
  INVESTMENT_SUPPORT: "Investment & Business Support",
  GENERAL_ENQUIRY: "General Enquiry",
};

export async function sendEnquiryNotification(enquiry: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping enquiry notification email.");
    return;
  }

  const notifyTo = process.env.NOTIFY_EMAIL_TO || "mariaiyabi@gmail.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";

  try {
    await resend.emails.send({
      from: "MariePrime Website <notifications@marieprimeglobal.com>",
      to: notifyTo,
      replyTo: enquiry.email,
      subject: `New enquiry: ${enquiry.fullName} — ${serviceLabels[enquiry.serviceInterest] ?? enquiry.serviceInterest}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">New website enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(enquiry.fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>
          <p><strong>Service:</strong> ${serviceLabels[enquiry.serviceInterest] ?? enquiry.serviceInterest}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(enquiry.message).replace(/\n/g, "<br/>")}</p>
          <p style="margin-top:24px;">
            <a href="${siteUrl}/admin/enquiries/${enquiry.id}" style="color:#C9A876;">
              View in admin dashboard →
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    // Never let a notification failure block the enquiry from being saved —
    // the enquiry itself is already in the database at this point.
    console.error("[email] failed to send enquiry notification:", error);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
