"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function LogoUploadField({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);

  return (
    <div className="space-y-4">
      {/* Submitted with the rest of the Settings form as `site_logo_url` */}
      <input type="hidden" name="site_logo_url" value={url} />

      <div className="flex flex-wrap items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-stub border border-forest-900/10 bg-cream-100">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Current logo" className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className="px-1 text-center text-[10px] leading-tight text-ink-400">
              No logo uploaded
            </span>
          )}
        </div>

        <div className="space-y-2">
          <MediaUploader
            label={url ? "Replace logo" : "Upload logo"}
            onUploaded={(asset) => setUrl(asset.url)}
          />
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="block text-xs font-medium text-red-600 hover:underline"
            >
              Remove logo (fall back to default mark)
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-ink-500">
        PNG, SVG or WebP. Uploads are optimised and delivered automatically via
        Cloudinary. Remember to click &ldquo;Save all settings&rdquo; below to apply.
      </p>
    </div>
  );
}
