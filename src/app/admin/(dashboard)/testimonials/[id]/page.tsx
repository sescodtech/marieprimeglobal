import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateTestimonial } from "@/lib/actions/testimonials";
import { TestimonialFormFields } from "@/components/admin/TestimonialFormFields";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  const updateWithId = updateTestimonial.bind(null, id);

  return (
    <div>
      <Link href="/admin/testimonials" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to testimonials
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Edit testimonial</h1>

      <form action={updateWithId} className="mt-8 max-w-2xl rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
        <TestimonialFormFields testimonial={testimonial} />
        <button type="submit" className="mt-8 rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
          Save changes
        </button>
      </form>
    </div>
  );
}
