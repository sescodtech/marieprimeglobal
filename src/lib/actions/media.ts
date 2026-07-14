"use server";

import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export async function deleteMediaAsset(id: string) {
  const actor = await requirePermission(PERMISSIONS.DELETE_IMAGES);
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  try {
    await cloudinary.uploader.destroy(asset.cloudinaryId);
  } catch (error) {
    console.error("[media] failed to delete from Cloudinary:", error);
  }

  await prisma.mediaAsset.delete({ where: { id } });

  await logAudit({
    actor,
    action: "MEDIA_DELETED",
    entityType: "MediaAsset",
    entityId: id,
    description: `${actor.name} deleted media asset "${asset.fileName}".`,
  });

  revalidatePath("/admin/media");
}

/** "Replace" = upload the new file first (via /api/upload, which creates
 *  its own MediaAsset row), then call this to remove the old one — simpler
 *  and less fragile than trying to update a row in place. Any place that
 *  already stored the old URL as a plain string (a Service's Json content,
 *  etc.) won't auto-update to the new one; that's a real limitation of not
 *  having reference tracking, not something this action can fix. */
export async function replaceMediaAsset(oldId: string) {
  const actor = await requirePermission(PERMISSIONS.UPLOAD_IMAGES);
  const existing = await prisma.mediaAsset.findUnique({ where: { id: oldId } });
  if (!existing) return;

  try {
    await cloudinary.uploader.destroy(existing.cloudinaryId);
  } catch (error) {
    console.error("[media] failed to delete old Cloudinary asset during replace:", error);
  }

  await prisma.mediaAsset.delete({ where: { id: oldId } });

  await logAudit({
    actor,
    action: "MEDIA_REPLACED",
    entityType: "MediaAsset",
    entityId: oldId,
    description: `${actor.name} replaced media asset "${existing.fileName}".`,
  });

  revalidatePath("/admin/media");
}
