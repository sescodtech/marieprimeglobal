import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const serviceLabels: Record<string, string> = {
  FLIGHT_BOOKING: "Flight Booking & Travel Solutions",
  VISA_IMMIGRATION: "Visa & Immigration Assistance",
  TRAVEL_LOAN: "Travel Loan Assistance",
  STUDY_ABROAD: "Study Abroad Support",
  BUSINESS_REGISTRATION: "Business Registration Services",
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

export async function sendJobApplicationNotification(application: {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message: string | null;
  cvUrl: string;
  coverLetterUrl: string | null;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping job application notification email.");
    return;
  }

  const notifyTo = process.env.NOTIFY_EMAIL_TO || "mariaiyabi@gmail.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";

  try {
    await resend.emails.send({
      from: "MariePrime Website <notifications@marieprimeglobal.com>",
      to: notifyTo,
      replyTo: application.email,
      subject: `New job application: ${application.fullName} — ${application.jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">New job application</h2>
          <p><strong>Role:</strong> ${escapeHtml(application.jobTitle)}</p>
          <p><strong>Name:</strong> ${escapeHtml(application.fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(application.phone)}</p>
          ${application.message ? `<p><strong>Message:</strong><br/>${escapeHtml(application.message).replace(/\n/g, "<br/>")}</p>` : ""}
          <p><strong>CV:</strong> <a href="${application.cvUrl}">${application.cvUrl}</a></p>
          ${application.coverLetterUrl ? `<p><strong>Cover letter:</strong> <a href="${application.coverLetterUrl}">${application.coverLetterUrl}</a></p>` : ""}
          <p style="margin-top:24px;">
            <a href="${siteUrl}/admin/careers/applications" style="color:#C9A876;">
              View in admin dashboard →
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] failed to send job application notification:", error);
  }
}
