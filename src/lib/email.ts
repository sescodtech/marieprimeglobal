import { Resend } from "resend";
import { ENQUIRY_SERVICE_LABELS as serviceLabels } from "@/lib/enquiryServiceLabels";
import { getEmailTemplate, renderTemplate } from "@/lib/emailTemplates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Sender address is env-driven rather than hardcoded so it can point at a
// verified test domain (e.g. during Resend domain verification) without a
// code change — just set EMAIL_FROM_ADDRESS in .env / Vercel and redeploy.
// Falls back to the production MariePrime domain once that's verified.
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || "notifications@marieprimeglobal.com";
const FROM_WEBSITE = `MariePrime Website <${EMAIL_FROM_ADDRESS}>`;
const FROM_GLOBAL = `MariePrime Global <${EMAIL_FROM_ADDRESS}>`;
const FROM_ADMIN = `MariePrime Admin <${EMAIL_FROM_ADDRESS}>`;

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
      from: FROM_WEBSITE,
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

export async function sendEnquiryConfirmationEmail(enquiry: {
  fullName: string;
  email: string;
  serviceInterest: string;
  subject?: string | null;
}) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — enquiry confirmation for ${enquiry.email}`);
    return;
  }

  const contactEmail = process.env.NOTIFY_EMAIL_TO || "mariaiyabi@gmail.com";

  const template = await getEmailTemplate("ENQUIRY_RECEIVED");
  if (template) {
    const vars = {
      clientName: enquiry.fullName,
      serviceName: serviceLabels[enquiry.serviceInterest] ?? enquiry.serviceInterest,
      companyName: "MariePrime Global",
    };
    try {
      await resend.emails.send({
        from: FROM_GLOBAL,
        to: enquiry.email,
        subject: renderTemplate(template.subject, vars),
        html: renderTemplate(template.bodyHtml, vars),
      });
    } catch (error) {
      console.error("[email] failed to send enquiry confirmation email (template):", error);
    }
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_GLOBAL,
      to: enquiry.email,
      subject: "We've received your enquiry",
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">Thanks for reaching out</h2>
          <p>Hi ${escapeHtml(enquiry.fullName)},</p>
          <p>
            We've received your enquiry${enquiry.subject ? ` about "${escapeHtml(enquiry.subject)}"` : ""}
            regarding ${serviceLabels[enquiry.serviceInterest] ?? enquiry.serviceInterest}. A member of our team
            will get back to you shortly.
          </p>
          <p style="margin-top:24px; font-size: 13px; color: #6b7280;">
            In the meantime, you can reach us directly at
            <a href="mailto:${contactEmail}" style="color:#C9A876;">${contactEmail}</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] failed to send enquiry confirmation email:", error);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    // RESEND_API_KEY isn't configured yet — fail safe by logging the link
    // so the flow is still usable (and testable) in local/dev environments
    // before email sending is wired up in production.
    console.warn(
      `[email] RESEND_API_KEY not set — password reset link for ${to}: ${resetUrl}`
    );
    return;
  }

  const template = await getEmailTemplate("PASSWORD_RESET");
  if (template) {
    const vars = { companyName: "MariePrime Global", resetUrl };
    try {
      await resend.emails.send({
        from: FROM_ADMIN,
        to,
        subject: renderTemplate(template.subject, vars),
        html: renderTemplate(template.bodyHtml, vars),
      });
    } catch (error) {
      console.error("[email] failed to send password reset email (template):", error);
    }
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_ADMIN,
      to,
      subject: "Reset your MariePrime admin password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">Reset your password</h2>
          <p>We received a request to reset the password for this admin account.</p>
          <p>This link expires in 1 hour and can only be used once.</p>
          <p style="margin-top:24px;">
            <a href="${resetUrl}" style="color:#C9A876;">Reset password →</a>
          </p>
          <p style="margin-top:24px; font-size: 12px; color: #6b7280;">
            If you didn't request this, you can safely ignore this email —
            your password will not be changed.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] failed to send password reset email:", error);
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
      from: FROM_WEBSITE,
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

export async function sendApplicationConfirmationEmail(application: {
  referenceNumber: string;
  applicantName: string;
  applicantEmail: string;
  serviceTitle: string;
}) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — application confirmation for ${application.applicantEmail}: ${application.referenceNumber}`
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const contactEmail = process.env.NOTIFY_EMAIL_TO || "mariaiyabi@gmail.com";
  const trackUrl = `${siteUrl}/track?ref=${encodeURIComponent(application.referenceNumber)}`;

  const template = await getEmailTemplate("APPLICATION_RECEIVED");
  if (template) {
    const vars = {
      clientName: application.applicantName,
      referenceNumber: application.referenceNumber,
      serviceName: application.serviceTitle,
      companyName: "MariePrime Global",
    };
    try {
      await resend.emails.send({
        from: FROM_GLOBAL,
        to: application.applicantEmail,
        subject: renderTemplate(template.subject, vars),
        html: renderTemplate(template.bodyHtml, vars),
      });
    } catch (error) {
      console.error("[email] failed to send application confirmation email (template):", error);
    }
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_GLOBAL,
      to: application.applicantEmail,
      subject: `Application received — ${application.referenceNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">We've received your application</h2>
          <p>Hi ${escapeHtml(application.applicantName)},</p>
          <p>Thank you for applying for <strong>${escapeHtml(application.serviceTitle)}</strong>. Our team will review it shortly.</p>
          <p style="margin-top:20px;">Your reference number:</p>
          <p style="font-family: monospace; font-size: 20px; font-weight: 600; color:#1B4332;">
            ${escapeHtml(application.referenceNumber)}
          </p>
          <p>Keep this number safe — you'll need it, along with the email address you applied with, to track your application.</p>
          <p style="margin-top:24px;">
            <a href="${trackUrl}" style="color:#C9A876;">Track your application →</a>
          </p>
          <p style="margin-top:24px; font-size: 13px; color: #6b7280;">
            Questions in the meantime? Reach us at
            <a href="mailto:${contactEmail}" style="color:#C9A876;">${contactEmail}</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    // Never let a failed confirmation email block the application from
    // being saved — it's already in the database at this point.
    console.error("[email] failed to send application confirmation email:", error);
  }
}

export async function sendApplicationAdminNotification(application: {
  id: string;
  referenceNumber: string;
  applicantName: string;
  applicantEmail: string;
  serviceTitle: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping application admin notification email.");
    return;
  }

  const notifyTo = process.env.NOTIFY_EMAIL_TO || "mariaiyabi@gmail.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";

  try {
    await resend.emails.send({
      from: FROM_WEBSITE,
      to: notifyTo,
      replyTo: application.applicantEmail,
      subject: `New application: ${application.applicantName} — ${application.serviceTitle} (${application.referenceNumber})`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">New service application</h2>
          <p><strong>Applicant:</strong> ${escapeHtml(application.applicantName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(application.applicantEmail)}</p>
          <p><strong>Service:</strong> ${escapeHtml(application.serviceTitle)}</p>
          <p><strong>Reference:</strong> ${escapeHtml(application.referenceNumber)}</p>
          <p style="margin-top:24px;">
            <a href="${siteUrl}/admin/applications/${application.id}" style="color:#C9A876;">
              View application →
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] failed to send application admin notification:", error);
  }
}

/** Sent whenever staff change an application's status, so the client hears
 *  about progress without needing to check the tracking page themselves. */
export async function sendApplicationStatusUpdateEmail(application: {
  referenceNumber: string;
  applicantName: string;
  applicantEmail: string;
  serviceTitle: string;
  statusLabel: string;
  note?: string | null;
}) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — status update for ${application.applicantEmail}: ${application.statusLabel}`
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const trackUrl = `${siteUrl}/track?ref=${encodeURIComponent(application.referenceNumber)}`;

  const templateKey =
    application.statusLabel === "Approved" || application.statusLabel === "Completed"
      ? "APPLICATION_APPROVED"
      : application.statusLabel === "Rejected"
        ? "APPLICATION_REJECTED"
        : application.statusLabel === "Documents Received"
          ? "DOCUMENTS_RECEIVED"
          : null;

  if (templateKey) {
    const template = await getEmailTemplate(templateKey);
    if (template) {
      const vars = {
        clientName: application.applicantName,
        referenceNumber: application.referenceNumber,
        serviceName: application.serviceTitle,
        status: application.statusLabel,
        companyName: "MariePrime Global",
      };
      try {
        await resend.emails.send({
          from: FROM_GLOBAL,
          to: application.applicantEmail,
          subject: renderTemplate(template.subject, vars),
          html: renderTemplate(template.bodyHtml, vars),
        });
      } catch (error) {
        console.error("[email] failed to send application status update email (template):", error);
      }
      return;
    }
  }

  try {
    await resend.emails.send({
      from: FROM_GLOBAL,
      to: application.applicantEmail,
      subject: `Application update — ${application.referenceNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">Your application status has changed</h2>
          <p>Hi ${escapeHtml(application.applicantName)},</p>
          <p>Your application for <strong>${escapeHtml(application.serviceTitle)}</strong> (${escapeHtml(
            application.referenceNumber
          )}) is now:</p>
          <p style="font-size: 18px; font-weight: 600; color:#1B4332;">${escapeHtml(application.statusLabel)}</p>
          ${application.note ? `<p>${escapeHtml(application.note).replace(/\n/g, "<br/>")}</p>` : ""}
          <p style="margin-top:24px;">
            <a href="${trackUrl}" style="color:#C9A876;">View full status →</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] failed to send application status update email:", error);
  }
}

/** Sent when staff request additional documents — includes a secure,
 *  tokenized link the client can use to upload without creating an account. */
export async function sendAdditionalDocumentsRequestEmail(application: {
  referenceNumber: string;
  applicantName: string;
  applicantEmail: string;
  serviceTitle: string;
  note: string;
  uploadToken: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const uploadUrl = `${siteUrl}/upload/${application.uploadToken}`;

  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — additional-documents request for ${application.applicantEmail}: ${uploadUrl}`
    );
    return;
  }

  const template = await getEmailTemplate("DOCUMENTS_REQUESTED");
  if (template) {
    const vars = {
      clientName: application.applicantName,
      referenceNumber: application.referenceNumber,
      serviceName: application.serviceTitle,
      companyName: "MariePrime Global",
      note: application.note,
      uploadUrl,
    };
    try {
      await resend.emails.send({
        from: FROM_GLOBAL,
        to: application.applicantEmail,
        subject: renderTemplate(template.subject, vars),
        html: renderTemplate(template.bodyHtml, vars),
      });
    } catch (error) {
      console.error("[email] failed to send additional-documents request email (template):", error);
    }
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_GLOBAL,
      to: application.applicantEmail,
      subject: `Action needed — additional documents for ${application.referenceNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B4332;">We need a bit more from you</h2>
          <p>Hi ${escapeHtml(application.applicantName)},</p>
          <p>
            To continue processing your application for <strong>${escapeHtml(application.serviceTitle)}</strong>
            (${escapeHtml(application.referenceNumber)}), please provide the following:
          </p>
          <p style="background:#F5F1E8; padding:12px 16px; border-radius:8px;">${escapeHtml(application.note).replace(/\n/g, "<br/>")}</p>
          <p style="margin-top:24px;">
            <a href="${uploadUrl}" style="background:#1B4332; color:#fff; padding:12px 22px; border-radius:8px; text-decoration:none; display:inline-block;">
              Upload documents
            </a>
          </p>
          <p style="margin-top:16px; font-size: 13px; color: #6b7280;">
            This link is unique to your application and doesn't require an account. It expires in 14 days.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] failed to send additional-documents request email:", error);
  }
}
