import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";

export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-cream-100 pt-24 pb-10 lg:pt-32 lg:pb-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Client Testimonials</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            What it's like to work with us.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <TestimonialsCarousel testimonials={testimonials} />
        </Reveal>
      </div>
    </section>
  );
}
