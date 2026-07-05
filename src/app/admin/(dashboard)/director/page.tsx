import { prisma } from "@/lib/prisma";
import { updateDirectorProfile } from "@/lib/actions/director";
import { DirectorPhotoField } from "@/components/admin/DirectorPhotoField";
import { directorProfile as fallback } from "@/lib/data";

export default async function DirectorProfilePage() {
  const director = await prisma.directorProfile.findFirst({ where: { isActive: true } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Director Profile</h1>
      <p className="mt-1 text-sm text-ink-500">
        Shown in the Leadership section of the About page.
      </p>

      <form
        action={updateDirectorProfile}
        className="mt-8 grid max-w-3xl gap-8 rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5 sm:grid-cols-[220px_1fr]"
      >
        <DirectorPhotoField initialUrl={director?.photoUrl ?? null} />

        <div className="space-y-5">
          <Field label="Full name">
            <input name="name" defaultValue={director?.name ?? fallback.name} required className="input" />
          </Field>
          <Field label="Position">
            <input
              name="position"
              defaultValue={director?.position ?? fallback.position}
              required
              className="input"
            />
          </Field>
          <Field label="Biography">
            <textarea
              name="biography"
              defaultValue={director?.biography ?? fallback.biography}
              required
              rows={7}
              className="input resize-none"
            />
          </Field>

          <button
            type="submit"
            className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
          >
            Save changes
          </button>
        </div>
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
