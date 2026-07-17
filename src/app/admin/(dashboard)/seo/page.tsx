import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { getGlobalSeoSettings } from "@/lib/content";
import { updateSeoSetting, updateGlobalSeoSettings } from "@/lib/actions/seo";

const pages = [
  { key: "home", label: "Home Page", defaultTitle: "MariePrime Global Services | Flights, Visas, Study Abroad & Business Registration" },
  { key: "about", label: "About Page", defaultTitle: "About Us | MariePrime Global Services" },
  { key: "services", label: "Services Page", defaultTitle: "Services | MariePrime Global Services" },
  { key: "visa", label: "Visa Service Page", defaultTitle: "Visa & Travel Assistance | MariePrime Global Services" },
  { key: "contact", label: "Contact Page", defaultTitle: "Contact Us | MariePrime Global Services" },
  { key: "blog", label: "Blog", defaultTitle: "Blog | MariePrime Global Services" },
  { key: "careers", label: "Careers", defaultTitle: "Careers | MariePrime Global Services" },
  { key: "faq", label: "FAQs", defaultTitle: "FAQs | MariePrime Global Services" },
] as const;

export default async function SeoSettingsPage() {
  await requirePermission(PERMISSIONS.MANAGE_SETTINGS);
  const [settings, globalSeo] = await Promise.all([prisma.seoSetting.findMany(), getGlobalSeoSettings()]);
  const map = new Map(settings.map((s) => [s.page, s]));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">SEO Management</h1>
      <p className="mt-1 text-sm text-ink-500">
        Global SEO applies site-wide as a fallback; per-page settings below override it.
      </p>

      <div className="mt-8 max-w-2xl space-y-6">
        <form action={updateGlobalSeoSettings} className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Global SEO</h2>
          <div className="mt-5 space-y-5">
            <Field label="Site title">
              <input name="seo_site_title" defaultValue={globalSeo.siteTitle} required className="input" />
            </Field>
            <Field label="Meta description">
              <textarea name="seo_meta_description" defaultValue={globalSeo.metaDescription} rows={2} className="input resize-none" />
            </Field>
            <Field label="Keywords (comma-separated)">
              <input name="seo_keywords" defaultValue={globalSeo.keywords} className="input" />
            </Field>
            <Field label="Canonical URL">
              <input name="seo_canonical_url" defaultValue={globalSeo.canonicalUrl} className="input" placeholder="https://marieprimeglobal.com" />
            </Field>
            <Field label="Open Graph image URL">
              <input name="seo_og_image_url" defaultValue={globalSeo.ogImageUrl} className="input" />
            </Field>
            <Field label="Twitter Card image URL">
              <input name="seo_twitter_image_url" defaultValue={globalSeo.twitterImageUrl} className="input" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Google verification">
                <input name="seo_google_verification" defaultValue={globalSeo.googleVerification} className="input" />
              </Field>
              <Field label="Bing verification">
                <input name="seo_bing_verification" defaultValue={globalSeo.bingVerification} className="input" />
              </Field>
              <Field label="Facebook verification">
                <input name="seo_facebook_verification" defaultValue={globalSeo.facebookVerification} className="input" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Google Analytics ID">
                <input name="seo_ga_id" defaultValue={globalSeo.gaId} className="input" placeholder="G-XXXXXXX" />
              </Field>
              <Field label="Google Tag Manager ID">
                <input name="seo_gtm_id" defaultValue={globalSeo.gtmId} className="input" placeholder="GTM-XXXXXXX" />
              </Field>
              <Field label="Facebook Pixel ID">
                <input name="seo_fb_pixel_id" defaultValue={globalSeo.fbPixelId} className="input" />
              </Field>
            </div>
          </div>
          <button type="submit" className="mt-6 rounded-stub bg-forest-700 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800">
            Save Global SEO
          </button>
        </form>

        {pages.map((page) => {
          const existing = map.get(page.key);
          return (
            <form
              key={page.key}
              action={updateSeoSetting}
              className="rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5"
            >
              <input type="hidden" name="page" value={page.key} />
              <h2 className="font-display text-lg font-semibold text-forest-900">{page.label}</h2>
              <div className="mt-5 space-y-5">
                <Field label="Meta title">
                  <input name="metaTitle" defaultValue={existing?.metaTitle ?? page.defaultTitle} required className="input" />
                </Field>
                <Field label="Meta description">
                  <textarea name="metaDescription" defaultValue={existing?.metaDescription ?? ""} required rows={2} className="input resize-none" />
                </Field>
                <Field label="Keywords (comma-separated)">
                  <input name="keywords" defaultValue={existing?.keywords ?? ""} className="input" />
                </Field>
                <Field label="Canonical URL">
                  <input name="canonicalUrl" defaultValue={existing?.canonicalUrl ?? ""} className="input" />
                </Field>
                <Field label="Open Graph image URL (from Media Library)">
                  <input name="ogImageUrl" defaultValue={existing?.ogImageUrl ?? ""} className="input" />
                </Field>
                <Field label="Twitter Card image URL">
                  <input name="twitterImageUrl" defaultValue={existing?.twitterImageUrl ?? ""} className="input" />
                </Field>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" name="noIndex" defaultChecked={existing?.noIndex ?? false} className="h-4 w-4 rounded border-forest-900/30 text-forest-700" />
                    NoIndex
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" name="noFollow" defaultChecked={existing?.noFollow ?? false} className="h-4 w-4 rounded border-forest-900/30 text-forest-700" />
                    NoFollow
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 rounded-stub bg-forest-700 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800"
              >
                Save {page.label}
              </button>
            </form>
          );
        })}
      </div>
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
