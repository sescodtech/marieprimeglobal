import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteFaq, toggleFaqPublished } from "@/lib/actions/faq";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">FAQs</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage the questions shown on the FAQ page and homepage preview.
          </p>
        </div>
        <Link
          href="/admin/faq/new"
          className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          <Plus size={16} />
          Add FAQ
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {faqs.length === 0 && (
          <div className="rounded-stub bg-cream-50 p-8 text-center text-ink-500 shadow-card ring-1 ring-forest-900/5">
            No FAQs yet. Add your first one, or run the seed script.
          </div>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-forest-700">
              {category}
            </h2>
            <div className="mt-3 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
              <table className="w-full text-left text-sm">
                <tbody>
                  {items.map((faq) => (
                    <tr key={faq.id} className="border-t border-forest-900/5 first:border-t-0">
                      <td className="px-5 py-4 font-medium text-forest-900">{faq.question}</td>
                      <td className="px-5 py-4">
                        <form action={toggleFaqPublished.bind(null, faq.id, !faq.isPublished)}>
                          <button
                            type="submit"
                            className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${
                              faq.isPublished
                                ? "bg-forest-700/10 text-forest-700"
                                : "bg-ink-500/10 text-ink-500"
                            }`}
                          >
                            {faq.isPublished ? "Published" : "Draft"}
                          </button>
                        </form>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/faq/${faq.id}`}
                            className="text-forest-700 hover:text-forest-900"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <form action={deleteFaq.bind(null, faq.id)}>
                            <button type="submit" className="text-red-500 hover:text-red-700" aria-label="Delete">
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
