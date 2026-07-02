import { getContactInfo, getHomeHero } from "@/lib/content";
import { updateSiteSettings } from "@/lib/actions/settings";

export default async function SiteSettingsPage() {
  const contact = await getContactInfo();
  const hero = await getHomeHero();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Contact details, social links, and the homepage hero — used across the site and footer.
      </p>

      <form action={updateSiteSettings} className="mt-8 max-w-2xl space-y-10">
        <section className="rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Contact information</h2>
          <div className="mt-5 space-y-5">
            <Field label="Email">
              <input name="contact_email" type="email" defaultValue={contact.email} className="input" />
            </Field>
            <Field label="Phone">
              <input name="contact_phone" defaultValue={contact.phone} className="input" />
            </Field>
            <Field label="WhatsApp number (digits only, with country code)">
              <input name="contact_whatsapp" defaultValue={contact.whatsapp} className="input" />
            </Field>
            <Field label="Address">
              <textarea name="contact_address" defaultValue={contact.address} rows={2} className="input resize-none" />
            </Field>
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Social links</h2>
          <p className="mt-1 text-xs text-ink-500">Placeholder links until real profiles are ready.</p>
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
          </div>
        </section>

        <section className="rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5">
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

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 4px;
          border: 1px solid rgba(15, 42, 32, 0.15);
          background: #fbf9f5;
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: #16211c;
        }
        .input:focus {
          outline: none;
          border-color: #c9a876;
        }
      `}</style>
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
