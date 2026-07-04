import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const altText = String(formData.get("altText") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "marieprime" },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Cloudinary automatically serves the best format/compression for the
    // requesting browser (WebP/AVIF, adjusted quality) when f_auto,q_auto is
    // present in the delivery URL. This is applied on-the-fly (non-destructive
    // to the stored original) and skipped for SVGs, which are already vector
    // and shouldn't be raster-transformed.
    const isSvg = uploadResult.secure_url.toLowerCase().endsWith(".svg");
    const optimizedUrl = isSvg
      ? uploadResult.secure_url
      : uploadResult.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");

    const asset = await prisma.mediaAsset.create({
      data: {
        url: optimizedUrl,
        cloudinaryId: uploadResult.public_id,
        altText: altText || file.name,
        fileName: file.name,
        fileType: file.type,
        width: uploadResult.width,
        height: uploadResult.height,
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("[upload] Cloudinary upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
