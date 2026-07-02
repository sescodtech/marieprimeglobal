"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export async function deleteMediaAsset(id: string) {
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  try {
    await cloudinary.uploader.destroy(asset.cloudinaryId);
  } catch (error) {
    console.error("[media] failed to delete from Cloudinary:", error);
  }

  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
}
