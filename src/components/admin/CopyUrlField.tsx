"use client";

export function CopyUrlField({ url }: { url: string }) {
  return (
    <input
      readOnly
      value={url}
      onClick={(e) => e.currentTarget.select()}
      className="w-full truncate rounded border border-forest-900/10 bg-cream-100 px-1.5 py-1 font-mono text-[10px] text-ink-500"
    />
  );
}
