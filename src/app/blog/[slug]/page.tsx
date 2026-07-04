import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) return {};

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  const relatedPosts = await prisma.blogPost.findMany({
    where: { isPublished: true, category: post.category, slug: { not: post.slug } },
    orderBy: { order: "asc" },
    take: 3,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    url: `${siteUrl}/blog/${post.slug}`,
    publisher: { "@type": "Organization", name: "MariePrime Global Services" },
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <section className="bg-forest-900 py-20 text-cream-50 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-cream-200/70 hover:text-cream-50"
            >
              <ArrowLeft size={15} />
              All posts
            </Link>
            <Eyebrow light className="mt-6">
              {post.category}
            </Eyebrow>
            <h1 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-cream-200/60">
              <span>{post.publishedLabel}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            {post.content ? (
              <div
                className="prose-mp"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />
            ) : (
              <p className="text-lg leading-relaxed text-ink-700">{post.excerpt}</p>
            )}
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <NewsletterSignup />
          </Reveal>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-cream-100 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow>More on {post.category}</Eyebrow>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((related, i) => (
                <Reveal key={related.slug} delay={i * 0.08}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="group flex h-full flex-col rounded-stub border border-forest-900/10 bg-cream-50 p-6 transition-colors duration-300 hover:border-gold-400/50"
                  >
                    <h3 className="font-display text-base font-semibold leading-snug text-forest-900">
                      {related.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                      {related.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700">
                      Read
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
