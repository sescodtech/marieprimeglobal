import Link from "next/link";
import { Plus, Pencil, Trash2, Copy, Archive, ArchiveRestore } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { deleteAnnouncement, toggleAnnouncementEnabled, duplicateAnnouncement, archiveAnnouncement } from "@/lib/actions/announcements";

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  await requireSuperAdmin();
  const { archived } = await searchParams;
  const showArchived = archived === "1";

  const announcements = await prisma.announcement.findMany({
    where: showArchived ? {} : { isArchived: false },
    orderBy: { priority: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Announcement Bar</h1>
          <p className="mt-1 text-sm text-ink-500">Site-wide notices shown at the top of the page.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={showArchived ? "/admin/announcements" : "/admin/announcements?archived=1"} className="text-sm font-medium text-ink-500 hover:text-forest-700">
            {showArchived ? "Hide archived" : "Show archived"}
          </Link>
          <Link
            href="/admin/announcements/new"
            className="inline-flex items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
          >
            <Plus size={16} />
            Add announcement
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {announcements.length === 0 && (
          <p className="rounded-stub bg-cream-50 p-8 text-center text-sm text-ink-500 shadow-card ring-1 ring-forest-900/5">
            No announcements yet.
          </p>
        )}
        {announcements.map((a) => (
          <div key={a.id} className="flex flex-col gap-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold text-forest-900">{a.title}</span>
                {a.isArchived && (
                  <span className="rounded-full bg-ink-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-500">Archived</span>
                )}
              </div>
              <p className="mt-1 truncate text-xs text-ink-500">{a.message}</p>
              <p className="mt-1 text-xs text-ink-500">{a.displayRule.replace(/_/g, " ")} · Priority {a.priority}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <form action={toggleAnnouncementEnabled.bind(null, a.id, !a.isEnabled)}>
                <button type="submit" className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${a.isEnabled ? "bg-forest-700/10 text-forest-700" : "bg-ink-500/10 text-ink-500"}`}>
                  {a.isEnabled ? "Enabled" : "Disabled"}
                </button>
              </form>
              <Link href={`/admin/announcements/${a.id}`} className="text-forest-700 hover:text-forest-900" title="Edit">
                <Pencil size={16} />
              </Link>
              <form action={duplicateAnnouncement.bind(null, a.id)}>
                <button type="submit" className="text-forest-700 hover:text-forest-900" title="Duplicate">
                  <Copy size={16} />
                </button>
              </form>
              <form action={archiveAnnouncement.bind(null, a.id, !a.isArchived)}>
                <button type="submit" className="text-ink-500 hover:text-forest-700" title={a.isArchived ? "Unarchive" : "Archive"}>
                  {a.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                </button>
              </form>
              <form action={deleteAnnouncement.bind(null, a.id)}>
                <button type="submit" className="text-red-500 hover:text-red-700" title="Delete">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
