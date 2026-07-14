import Image from "next/image";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { hasGrantedPermission, PERMISSIONS } from "@/lib/permissions";
import { deleteMediaAsset } from "@/lib/actions/media";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyUrlField } from "@/components/admin/CopyUrlField";
import { ReplaceMediaButton } from "@/components/admin/ReplaceMediaButton";

export default async function MediaLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const actor = await requirePermission(PERMISSIONS.UPLOAD_IMAGES);
  const canDelete = hasGrantedPermission(actor.permissions, PERMISSIONS.DELETE_IMAGES);
  const { q } = await searchParams;

  const assets = await prisma.mediaAsset.findMany({
    where: q?.trim()
      ? { OR: [{ fileName: { contains: q.trim(), mode: "insensitive" } }, { altText: { contains: q.trim(), mode: "insensitive" } }] }
      : {},
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Media Library</h1>
          <p className="mt-1 text-sm text-ink-500">
            Images uploaded here are stored on Cloudinary. Copy a URL to use it on the Director
            Profile, a Service, or a Testimonial.
          </p>
        </div>
        <MediaUploader />
      </div>

      <form method="GET" className="mt-6 max-w-xs">
        <input type="text" name="q" defaultValue={q} placeholder="Search by filename…" className="input" />
      </form>

      {assets.length === 0 ? (
        <p className="mt-10 rounded-stub bg-cream-50 p-6 sm:p-10 text-center text-sm text-ink-500 shadow-card">
          {q ? "No media matched your search." : "No media uploaded yet. Upload your first image above."}
          {!q && (
            <>
              <br />
              <span className="mt-1 block text-xs text-ink-300">
                Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.
              </span>
            </>
          )}
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
                  <div className="flex items-center gap-3">
                    <ReplaceMediaButton assetId={asset.id} />
                    {canDelete && (
                      <form action={deleteMediaAsset.bind(null, asset.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700" aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
