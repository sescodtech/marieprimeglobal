import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { prisma } from "@/lib/prisma";
import { getSeoSetting } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("blog");
  return {
    title: seo?.metaTitle ?? "Blog",
    description:
      seo?.metaDescription ??
      "Notes on visas, immigration, study abroad and travel from the MariePrime Global Services team.",
    alternates: { canonical: "/blog" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <section className="bg-forest-900 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              From The Desk
            </Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Notes on visas, travel and getting it right the first time.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75">
              Practical, specific guidance drawn from the cases we actually handle — not generic
              advice recycled from elsewhere.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <BlogGrid posts={posts} />
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-16 max-w-2xl">
            <NewsletterSignup />
          </Reveal>
        </div>
      </section>
    </>
  );
}
