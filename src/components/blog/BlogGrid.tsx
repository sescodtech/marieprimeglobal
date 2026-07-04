"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import type { BlogPost } from "@prisma/client";
import { cn } from "@/lib/utils";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, activeCategory, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200",
                activeCategory === category
                  ? "border-forest-700 bg-forest-700 text-cream-50"
                  : "border-forest-900/15 text-ink-700 hover:border-forest-700 hover:text-forest-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="input pl-9"
          />
        </div>
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <motion.div key={post.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-stub border border-forest-900/10 bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 transition-colors duration-300 hover:border-gold-400/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest-700">
                  {post.category}
                </span>
                <span className="font-mono text-[11px] text-ink-500">{post.publishedLabel}</span>
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-forest-900">
                {post.title}
              </h2>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between border-t border-forest-900/10 pt-4">
                <span className="font-mono text-xs text-ink-500">{post.readTime}</span>
                <ArrowRight
                  size={16}
                  className="text-forest-700 transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-14 text-center text-sm text-ink-500">
          No posts match your search — try a different term or category.
        </p>
      )}
    </div>
  );
}
