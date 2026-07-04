import type { BlogPost } from "@prisma/client";

export function BlogPostFormFields({ post }: { post?: BlogPost }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input name="title" defaultValue={post?.title} required className="input" />
        </Field>
        <Field label="Slug (used in URL, lowercase-with-hyphens)">
          <input name="slug" defaultValue={post?.slug} required className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Category">
          <input name="category" defaultValue={post?.category} required className="input" />
        </Field>
        <Field label="Read time (e.g. 5 min read)">
          <input name="readTime" defaultValue={post?.readTime} required className="input" />
        </Field>
        <Field label="Published label (e.g. June 2026)">
          <input name="publishedLabel" defaultValue={post?.publishedLabel} required className="input" />
        </Field>
      </div>

      <Field label="Excerpt (shown on the blog grid)">
        <textarea name="excerpt" defaultValue={post?.excerpt} required rows={3} className="input resize-none" />
      </Field>

      <Field label="Full content (Markdown — shown on the post's own page). Leave blank to show only the excerpt.">
        <textarea
          name="content"
          defaultValue={post?.content ?? ""}
          rows={12}
          className="input resize-none font-mono text-sm"
          placeholder={"## A heading\n\nA paragraph. **Bold** and _italic_ work, as do:\n\n- bullet lists\n- [links](https://example.com)"}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Meta title (SEO, optional)">
          <input name="metaTitle" defaultValue={post?.metaTitle ?? ""} className="input" />
        </Field>
        <Field label="Meta description (SEO, optional)">
          <input name="metaDescription" defaultValue={post?.metaDescription ?? ""} className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display order">
          <input name="order" type="number" defaultValue={post?.order ?? 0} className="input" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={post?.isPublished ?? true}
            className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
          />
          Published (visible on the live site)
        </label>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}
