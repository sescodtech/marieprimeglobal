import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { createPopup } from "@/lib/actions/popups";
import { PopupFormFields } from "@/components/admin/PopupFormFields";

export default async function NewPopupPage() {
  await requireSuperAdmin();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/popups" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to popups
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Add popup</h1>

      <form action={createPopup} className="mt-8 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-8">
        <PopupFormFields />
        <button
          type="submit"
          className="mt-6 inline-flex items-center gap-2 rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          Create popup
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
