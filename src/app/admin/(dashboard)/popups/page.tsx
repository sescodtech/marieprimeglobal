import Link from "next/link";
import { Plus, Pencil, Trash2, Copy, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { deletePopup, togglePopupEnabled, duplicatePopup } from "@/lib/actions/popups";

export default async function PopupsPage() {
  await requireSuperAdmin();
  const popups = await prisma.popup.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Popup Manager</h1>
          <p className="mt-1 text-sm text-ink-500">Promotions, notices, and announcements shown as on-site popups.</p>
        </div>
        <Link
          href="/admin/popups/new"
          className="inline-flex items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          <Plus size={16} />
          Add popup
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {popups.length === 0 && (
          <p className="rounded-stub bg-cream-50 p-8 text-center text-sm text-ink-500 shadow-card ring-1 ring-forest-900/5">
            No popups yet.
          </p>
        )}
        {popups.map((popup) => {
          const closeRate = popup.views > 0 ? Math.round((popup.closes / popup.views) * 100) : 0;
          return (
            <div key={popup.id} className="flex flex-col gap-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-semibold text-forest-900">{popup.title}</span>
                  <span className="rounded-full bg-forest-700/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-forest-700">
                    {popup.popupType.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  {popup.displayRule.replace(/_/g, " ")} · {popup.triggerRule.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {popup.views} views · {popup.clicks} clicks · {closeRate}% close rate
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <form action={togglePopupEnabled.bind(null, popup.id, !popup.isEnabled)}>
                  <button
                    type="submit"
                    className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${popup.isEnabled ? "bg-forest-700/10 text-forest-700" : "bg-ink-500/10 text-ink-500"}`}
                  >
                    {popup.isEnabled ? "Enabled" : "Disabled"}
                  </button>
                </form>
                <Link href={`/admin/popups/${popup.id}/preview`} target="_blank" className="text-forest-700 hover:text-forest-900" title="Preview">
                  <Eye size={16} />
                </Link>
                <Link href={`/admin/popups/${popup.id}`} className="text-forest-700 hover:text-forest-900" title="Edit">
                  <Pencil size={16} />
                </Link>
                <form action={duplicatePopup.bind(null, popup.id)}>
                  <button type="submit" className="text-forest-700 hover:text-forest-900" title="Duplicate">
                    <Copy size={16} />
                  </button>
                </form>
                <form action={deletePopup.bind(null, popup.id)}>
                  <button type="submit" className="text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
