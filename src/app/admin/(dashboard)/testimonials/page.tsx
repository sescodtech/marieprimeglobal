import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteTestimonial, toggleTestimonialPublished } from "@/lib/actions/testimonials";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Testimonials</h1>
          <p className="mt-1 text-sm text-ink-500">Manage client quotes shown on the Home page.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          <Plus size={16} />
          Add testimonial
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {testimonials.length === 0 && (
          <p className="rounded-stub bg-cream-50 p-5 sm:p-8 text-center text-sm text-ink-500 shadow-card">
            No testimonials yet.
          </p>
        )}
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base font-semibold text-forest-900">
                  {t.clientName}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
                  {t.clientRole}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5 text-gold-500">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={12} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{t.quote}</p>
            </div>
            <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
              <form action={toggleTestimonialPublished.bind(null, t.id, !t.isPublished)}>
                <button
                  type="submit"
                  className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${
                    t.isPublished ? "bg-forest-700/10 text-forest-700" : "bg-ink-500/10 text-ink-500"
                  }`}
                >
                  {t.isPublished ? "Published" : "Draft"}
                </button>
              </form>
              <div className="flex gap-3">
                <Link href={`/admin/testimonials/${t.id}`} className="text-forest-700 hover:text-forest-900">
                  <Pencil size={16} />
                </Link>
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <button type="submit" className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
