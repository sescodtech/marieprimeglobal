import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { createAnnouncement } from "@/lib/actions/announcements";
import { AnnouncementFormFields } from "@/components/admin/AnnouncementFormFields";

export default async function NewAnnouncementPage() {
  await requireSuperAdmin();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/announcements" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to announcements
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Add announcement</h1>

      <form action={createAnnouncement} className="mt-8 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-8">
        <AnnouncementFormFields />
        <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
          Create announcement
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
