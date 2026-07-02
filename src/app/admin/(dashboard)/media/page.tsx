import Image from "next/image";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteMediaAsset } from "@/lib/actions/media";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyUrlField } from "@/components/admin/CopyUrlField";

export default async function MediaLibraryPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { uploadedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Media Library</h1>
          <p className="mt-1 text-sm text-ink-500">
            Images uploaded here are stored on Cloudinary. Copy a URL to use it on the Director
            Profile, a Service, or a Testimonial.
          </p>
        </div>
        <MediaUploader />
      </div>

      {assets.length === 0 ? (
        <p className="mt-10 rounded-stub bg-cream-50 p-10 text-center text-sm text-ink-500 shadow-card">
          No media uploaded yet. Upload your first image above.
          <br />
          <span className="mt-1 block text-xs text-ink-300">
            Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.
          </span>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5"
            >
              <div className="relative aspect-square w-full bg-forest-900/5">
                <Image
                  src={asset.url}
                  alt={asset.altText || asset.fileName}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-ink-500">{asset.fileName}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <CopyUrlField url={asset.url} />
                  <form action={deleteMediaAsset.bind(null, asset.id)}>
                    <button type="submit" className="text-red-500 hover:text-red-700" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
