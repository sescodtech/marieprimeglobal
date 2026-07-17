import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marieprimeglobal.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/apply`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/track`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/careers`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [services, posts, jobs] = await Promise.all([
    prisma.service.findMany({ where: { isPublished: true, isArchived: false }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.jobListing.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const careerRoutes: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${siteUrl}/careers/${j.slug}`,
    lastModified: j.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...careerRoutes];
}
