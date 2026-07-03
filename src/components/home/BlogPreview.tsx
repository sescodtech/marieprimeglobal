import { ArrowRight } from "lucide-react";
import { homeBlogPreview } from "@/lib/data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function BlogPreview() {
  return (
    <section className="bg-cream-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow>From The Desk</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight text-forest-900 sm:text-4xl">
            Notes on visas, travel and getting it right the first time.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {homeBlogPreview.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.08}>
              <article className="group flex h-full cursor-default flex-col rounded-stub border border-forest-900/10 bg-cream-100 p-6 transition-colors duration-300 hover:border-gold-400/50">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest-700">
                  {post.category}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-forest-900">
                  {post.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-forest-900/10 pt-4">
                  <span className="font-mono text-xs text-ink-500">{post.readTime}</span>
                  <ArrowRight
                    size={16}
                    className="text-forest-700 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
