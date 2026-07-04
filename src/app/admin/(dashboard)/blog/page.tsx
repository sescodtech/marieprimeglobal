import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost, toggleBlogPostPublished } from "@/lib/actions/blog";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Blog</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage the posts shown on the Blog page and homepage preview.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          <Plus size={16} />
          Add post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-900 text-cream-100">
            <tr>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-500">
                  No posts yet. Add your first one, or run the seed script.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-forest-900/5">
                <td className="px-5 py-4 font-mono text-xs text-ink-500">{post.category}</td>
                <td className="px-5 py-4 font-medium text-forest-900">{post.title}</td>
                <td className="px-5 py-4">
                  <form action={toggleBlogPostPublished.bind(null, post.id, !post.isPublished)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${
                        post.isPublished
                          ? "bg-forest-700/10 text-forest-700"
                          : "bg-ink-500/10 text-ink-500"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-forest-700 hover:text-forest-900"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <form action={deleteBlogPost.bind(null, post.id)}>
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
  );
}
