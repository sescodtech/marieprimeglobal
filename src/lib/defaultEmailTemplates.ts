import type { EmailTemplateKey } from "./emailTemplates";

export const DEFAULT_EMAIL_TEMPLATES: Record<EmailTemplateKey, { subject: string; bodyHtml: string }> = {
  APPLICATION_RECEIVED: {
    subject: "Application received — {{referenceNumber}}",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">We've received your application</h2>
  <p>Hi {{clientName}},</p>
  <p>Thank you for applying for <strong>{{serviceName}}</strong>. Our team will review it shortly.</p>
  <p style="margin-top:20px;">Your reference number:</p>
  <p style="font-family: monospace; font-size: 20px; font-weight: 600; color:#1B4332;">{{referenceNumber}}</p>
  <p>Keep this number safe — you'll need it, along with the email address you applied with, to track your application.</p>
  <p style="margin-top:24px; font-size: 13px; color: #6b7280;">Questions in the meantime? Reach out to {{companyName}}.</p>
</div>`,
  },
  APPLICATION_APPROVED: {
    subject: "Application approved — {{referenceNumber}}",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">Your application has been approved</h2>
  <p>Hi {{clientName}},</p>
  <p>Great news — your application for <strong>{{serviceName}}</strong> ({{referenceNumber}}) has been approved.</p>
  <p>Our team will be in touch with next steps.</p>
</div>`,
  },
  APPLICATION_REJECTED: {
    subject: "Application update — {{referenceNumber}}",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">Your application status has changed</h2>
  <p>Hi {{clientName}},</p>
  <p>Your application for <strong>{{serviceName}}</strong> ({{referenceNumber}}) was not approved this time.</p>
  <p>Contact {{companyName}} if you have questions or would like to discuss next steps.</p>
</div>`,
  },
  DOCUMENTS_REQUESTED: {
    subject: "Action needed — additional documents for {{referenceNumber}}",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">We need a bit more from you</h2>
  <p>Hi {{clientName}},</p>
  <p>To continue processing your application for <strong>{{serviceName}}</strong> ({{referenceNumber}}), please provide the following:</p>
  <p style="background:#F5F1E8; padding:12px 16px; border-radius:8px;">{{note}}</p>
  <p style="margin-top:24px;">
    <a href="{{uploadUrl}}" style="background:#1B4332; color:#fff; padding:12px 22px; border-radius:8px; text-decoration:none; display:inline-block;">
      Upload documents
    </a>
  </p>
  <p style="margin-top:16px; font-size: 13px; color: #6b7280;">This link is unique to your application and doesn't require an account.</p>
</div>`,
  },
  DOCUMENTS_RECEIVED: {
    subject: "Documents received — {{referenceNumber}}",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">Thanks — documents received</h2>
  <p>Hi {{clientName}},</p>
  <p>We've received the additional documents for your application ({{referenceNumber}}) and are continuing the review.</p>
</div>`,
  },
  ENQUIRY_RECEIVED: {
    subject: "We've received your enquiry",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">Thanks for reaching out</h2>
  <p>Hi {{clientName}},</p>
  <p>We've received your enquiry regarding {{serviceName}}. A member of the {{companyName}} team will get back to you shortly.</p>
</div>`,
  },
  NEWSLETTER: {
    subject: "{{subject}}",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 560px;">
  {{message}}
  <p style="margin-top:32px; font-size: 12px; color: #9ca3af;">
    You're receiving this because you subscribed to {{companyName}}'s newsletter.
  </p>
</div>`,
  },
  PASSWORD_RESET: {
    subject: "Reset your password",
    bodyHtml: `<div style="font-family: sans-serif; max-width: 480px;">
  <h2 style="color:#1B4332;">Reset your password</h2>
  <p>We received a request to reset your {{companyName}} admin password. This link expires in 1 hour.</p>
  <p style="margin-top:24px;"><a href="{{resetUrl}}" style="color:#C9A876;">Reset password →</a></p>
  <p style="margin-top:16px; font-size: 13px; color: #6b7280;">If you didn't request this, you can safely ignore this email.</p>
</div>`,
  },
};
