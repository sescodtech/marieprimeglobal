import { prisma } from "@/lib/prisma";
import { updateSeoSetting } from "@/lib/actions/seo";

const pages = [
  { key: "home", label: "Home Page", defaultTitle: "MariePrime Global Services | Flights, Visas, Study Abroad & Business Registration" },
  { key: "about", label: "About Page", defaultTitle: "About Us | MariePrime Global Services" },
  { key: "services", label: "Services Page", defaultTitle: "Services | MariePrime Global Services" },
  { key: "contact", label: "Contact Page", defaultTitle: "Contact Us | MariePrime Global Services" },
] as const;

export default async function SeoSettingsPage() {
  const settings = await prisma.seoSetting.findMany();
  const map = new Map(settings.map((s) => [s.page, s]));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">SEO Settings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Meta title, description, keywords and Open Graph image, per page.
      </p>

      <div className="mt-8 max-w-2xl space-y-6">
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
                  <input
                    name="metaTitle"
                    defaultValue={existing?.metaTitle ?? page.defaultTitle}
                    required
                    className="input"
                  />
                </Field>
                <Field label="Meta description">
                  <textarea
                    name="metaDescription"
                    defaultValue={existing?.metaDescription ?? ""}
                    required
                    rows={2}
                    className="input resize-none"
                  />
                </Field>
                <Field label="Keywords (comma-separated)">
                  <input name="keywords" defaultValue={existing?.keywords ?? ""} className="input" />
                </Field>
                <Field label="Open Graph image URL (from Media Library)">
                  <input name="ogImageUrl" defaultValue={existing?.ogImageUrl ?? ""} className="input" />
                </Field>
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
