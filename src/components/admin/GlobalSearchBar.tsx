import { Search } from "lucide-react";

export function GlobalSearchBar() {
  return (
    <form action="/admin/search" method="GET" className="relative w-full max-w-xs">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
      <input
        type="text"
        name="q"
        placeholder="Search everything…"
        className="w-full rounded-stub border border-forest-900/15 bg-cream-100 py-2 pl-9 pr-3 text-sm focus:border-gold-500 focus:outline-none"
      />
    </form>
  );
}
