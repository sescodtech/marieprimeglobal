import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { getDocumentRequirements, MAX_UPLOAD_BYTES_DEFAULT } from "@/lib/applicationForms/documents";
import type { ServiceApplicationType } from "@/lib/applicationForms/types";

const FALLBACK_ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

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
 *
 * If `serviceType` + `docKey` are supplied, this validates the file against
 * that specific document's Super-Admin-configured file types and max size
 * (never trusting a client-supplied limit) — falling back to the global
 * defaults if they're missing or don't resolve to a known requirement.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const serviceType = formData.get("serviceType");
    const docKey = formData.get("docKey");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    let allowedTypes: string[] = FALLBACK_ALLOWED_TYPES;
    let maxSizeBytes = MAX_UPLOAD_BYTES_DEFAULT;

    if (typeof serviceType === "string" && typeof docKey === "string") {
      const requirements = await getDocumentRequirements(serviceType as ServiceApplicationType);
      const requirement = requirements.find((r) => r.id === docKey);
      if (requirement) {
        allowedTypes = requirement.accept.split(",").map((t) => t.trim()).filter(Boolean);
        maxSizeBytes = requirement.maxSizeBytes ?? MAX_UPLOAD_BYTES_DEFAULT;
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "That file type isn't accepted for this document." }, { status: 400 });
    }
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `Files must be under ${Math.round(maxSizeBytes / (1024 * 1024))}MB.` },
        { status: 400 }
      );
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
