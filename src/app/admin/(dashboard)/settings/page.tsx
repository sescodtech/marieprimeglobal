import {
  getContactInfo,
  getHomeHero,
  getBrandingSettings,
  getEmailSettings,
  getUploadSettings,
  getSecuritySettings,
  getGlobalFormControls,
} from "@/lib/content";
import { updateSiteSettings } from "@/lib/actions/settings";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default async function SiteSettingsPage() {
  const [contact, hero, branding, email, upload, security, formControls] = await Promise.all([
    getContactInfo(),
    getHomeHero(),
    getBrandingSettings(),
    getEmailSettings(),
    getUploadSettings(),
    getSecuritySettings(),
    getGlobalFormControls(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-500">Company details, branding, social links, email, uploads, and security.</p>

      <form action={updateSiteSettings} className="mt-8 max-w-2xl space-y-10">
        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">General</h2>
          <div className="mt-5 space-y-5">
            <Field label="Company name">
              <input name="company_name" defaultValue={contact.companyName} className="input" />
            </Field>
            <Field label="Company email">
              <input name="contact_email" type="email" defaultValue={contact.email} className="input" />
            </Field>
            <Field label="Phone number">
              <input name="contact_phone" defaultValue={contact.phone} className="input" />
            </Field>
            <Field label="WhatsApp number (digits only, with country code)">
              <input name="contact_whatsapp" defaultValue={contact.whatsapp} className="input" />
            </Field>
            <Field label="Office address">
              <textarea name="contact_address" defaultValue={contact.address} rows={2} className="input resize-none" />
            </Field>
            <Field label="Working hours">
              <input name="working_hours" defaultValue={contact.workingHours} className="input" placeholder="Mon–Fri, 9am–5pm WAT" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Branding</h2>
          <div className="mt-5 space-y-5">
            <Field label="Logo (light backgrounds)">
              <ImageUploadField fieldName="site_logo_url" initialUrl={branding.logoUrl} label="Logo" />
            </Field>
            <Field label="Dark logo (dark backgrounds)">
              <ImageUploadField fieldName="dark_logo_url" initialUrl={branding.darkLogoUrl} label="Dark logo" />
            </Field>
            <Field label="Favicon">
              <ImageUploadField fieldName="favicon_url" initialUrl={branding.faviconUrl} label="Favicon" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Social media</h2>
          <div className="mt-5 space-y-5">
            <Field label="Instagram">
              <input name="social_instagram" defaultValue={contact.socials.instagram} className="input" />
            </Field>
            <Field label="LinkedIn">
              <input name="social_linkedin" defaultValue={contact.socials.linkedin} className="input" />
            </Field>
            <Field label="Facebook">
              <input name="social_facebook" defaultValue={contact.socials.facebook} className="input" />
            </Field>
            <Field label="TikTok">
              <input name="social_tiktok" defaultValue={contact.socials.tiktok} className="input" />
            </Field>
            <Field label="X (Twitter)">
              <input name="social_x" defaultValue={contact.socials.x} className="input" />
            </Field>
            <Field label="YouTube">
              <input name="social_youtube" defaultValue={contact.socials.youtube} className="input" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Email</h2>
          <p className="mt-1 text-xs text-ink-500">
            Sent via Resend. Changing these doesn't affect your verified sending domain — only how
            outgoing mail is labeled and where replies/notifications go.
          </p>
          <div className="mt-5 space-y-5">
            <Field label="Sender name">
              <input name="email_sender_name" defaultValue={email.senderName} className="input" />
            </Field>
            <Field label="Reply-to email">
              <input name="email_reply_to" type="email" defaultValue={email.replyTo} className="input" />
            </Field>
            <Field label="Notification email (where admin alerts go)">
              <input name="email_notification_to" type="email" defaultValue={email.notificationEmail} className="input" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Upload settings</h2>
          <div className="mt-5 space-y-5">
            <Field label="Maximum upload size (MB)">
              <input name="upload_max_size_mb" type="number" min={1} max={50} defaultValue={upload.maxSizeMb} className="input" />
            </Field>
            <Field label="Allowed file types (comma-separated MIME types)">
              <input name="upload_allowed_types" defaultValue={upload.allowedTypes} className="input" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Security</h2>
          <div className="mt-5 space-y-5">
            <Field label="Session timeout (minutes)">
              <input name="security_session_timeout_minutes" type="number" min={15} defaultValue={security.sessionTimeoutMinutes} className="input" />
            </Field>
            <Field label="Minimum password length">
              <input name="security_password_min_length" type="number" min={8} max={64} defaultValue={security.passwordMinLength} className="input" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Website Form Control — Global</h2>
          <p className="mt-1 text-xs text-ink-500">
            Overrides every service at once. Turning applications off site-wide hides every Apply button
            regardless of a service's own setting.
          </p>
          <div className="mt-5 space-y-5">
            <Field label="Applications (site-wide)">
              <select name="global_applications_enabled" defaultValue={String(formControls.applicationsEnabled)} className="input">
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </Field>
            <Field label="Enquiries (site-wide)">
              <select name="global_enquiries_enabled" defaultValue={String(formControls.enquiriesEnabled)} className="input">
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Homepage hero</h2>
          <div className="mt-5 space-y-5">
            <Field label="Eyebrow label">
              <input name="hero_eyebrow" defaultValue={hero.heroEyebrow} className="input" />
            </Field>
            <Field label="Headline">
              <textarea name="hero_headline" defaultValue={hero.heroHeadline} rows={2} className="input resize-none" />
            </Field>
            <Field label="Subtext">
              <textarea name="hero_subtext" defaultValue={hero.heroSubtext} rows={3} className="input resize-none" />
            </Field>
          </div>
        </section>

        <button
          type="submit"
          className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          Save all settings
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}
