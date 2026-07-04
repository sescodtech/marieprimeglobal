import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

/**
 * Renders admin-authored Markdown to HTML for blog post content.
 * Blog content is only ever written by trusted admins through /admin/blog,
 * never by public form submissions, so this intentionally skips a client-side
 * sanitizer pass (same trust boundary as any other CMS rich-text field).
 */
export function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string;
}
