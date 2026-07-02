"use client";

import { useState } from "react";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function DirectorPhotoField({ initialUrl }: { initialUrl: string | null }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialUrl);

  return (
    <div>
      <input type="hidden" name="photoUrl" value={photoUrl ?? ""} />
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-stub bg-forest-800">
        {photoUrl ? (
          <Image src={photoUrl} alt="Director portrait" fill className="object-cover" sizes="220px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UserCircle size={48} className="text-cream-50/30" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <MediaUploader
          label={photoUrl ? "Replace photo" : "Upload photo"}
          onUploaded={(asset) => setPhotoUrl(asset.url)}
        />
      </div>
      <p className="mt-2 text-xs text-ink-500">
        Upload the AI-generated professional portrait here. It's stored on Cloudinary and used on
        the About page.
      </p>
    </div>
  );
}
