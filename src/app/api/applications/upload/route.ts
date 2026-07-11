import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

function uploadToCloudinary(buffer: Buffer, fileName: string, mimeType: string): Promise<{ url: string; publicId: string }> {
  const resourceType = mimeType === "application/pdf" ? "raw" : "image";
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "marieprime/applications/documents",
        resource_type: resourceType,
        filename_override: fileName,
        use_filename: true,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Uploads a single application document as soon as the client selects it —
 * this is what makes preview/replace/delete work *before* the application is
 * submitted. The file is not linked to an application yet; the wizard holds
 * the returned url/publicId in memory and sends them along with the final
 * submission in /api/applications/submit.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Files must be a JPG, PNG or PDF." }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Files must be under 8MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(buffer, file.name, file.type);

    return NextResponse.json({ url, publicId, mimeType: file.type, fileName: file.name }, { status: 201 });
  } catch (error) {
    console.error("[applications/upload] upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

/** Lets the wizard clean up a document the applicant replaced or removed
 *  before ever submitting, so it doesn't linger in storage unused. */
export async function DELETE(request: Request) {
  try {
    const { publicId, resourceType } = await request.json();
    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json({ error: "Missing publicId." }, { status: 400 });
    }
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === "raw" ? "raw" : "image",
    });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    // Best-effort — an orphaned Cloudinary asset is a minor storage cost,
    // not worth failing the applicant's flow over.
    console.error("[applications/upload] delete failed (non-fatal):", error);
    return NextResponse.json({ deleted: false });
  }
}
