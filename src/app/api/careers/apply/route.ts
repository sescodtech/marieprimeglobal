import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { sendJobApplicationNotification } from "@/lib/email";

const fieldsSchema = z.object({
  jobListingId: z.string().optional(),
  jobTitle: z.string().min(2),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().optional(),
});

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function uploadRawFile(buffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "marieprime/applications", resource_type: "raw", filename_override: fileName, use_filename: true },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function validateAndUpload(file: FormDataEntryValue | null, required: boolean) {
  if (!(file instanceof File)) {
    if (required) throw new Error("A CV file is required.");
    return null;
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Files must be a PDF or Word document.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Files must be under 5MB.");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadRawFile(buffer, file.name);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const parsed = fieldsSchema.safeParse({
      jobListingId: formData.get("jobListingId") || undefined,
      jobTitle: formData.get("jobTitle"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let cvUrl: string;
    let coverLetterUrl: string | null;
    try {
      cvUrl = (await validateAndUpload(formData.get("cv"), true))!;
      coverLetterUrl = await validateAndUpload(formData.get("coverLetter"), false);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "File upload failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        ...parsed.data,
        cvUrl,
        coverLetterUrl,
      },
    });

    void sendJobApplicationNotification(application);

    return NextResponse.json({ id: application.id }, { status: 201 });
  } catch (error) {
    console.error("[careers/apply] failed to save application:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
