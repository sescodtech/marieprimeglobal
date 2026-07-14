"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function ImageUploadField({
  fieldName,
  initialUrl,
  label,
}: {
  fieldName: string;
  initialUrl: string;
  label: string;
}) {
  const [url, setUrl] = useState(initialUrl);

  return (
    <div className="space-y-3">
      <input type="hidden" name={fieldName} value={url} />
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-stub border border-forest-900/10 bg-cream-100">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={label} className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className="px-1 text-center text-[10px] leading-tight text-ink-400">None set</span>
          )}
        </div>
        <MediaUploader label={url ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`} onUploaded={(asset) => setUrl(asset.url)} />
      </div>
    </div>
  );
}
