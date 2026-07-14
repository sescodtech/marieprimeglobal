import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServiceApplicationConfig } from "@/lib/applicationForms/config";
import { getDocumentRequirements } from "@/lib/applicationForms/documents";
import { buildApplicationSchema } from "@/lib/applicationForms/schema";
import { generateReferenceNumber } from "@/lib/applicationForms/referenceNumber";
import { sendApplicationConfirmationEmail, sendApplicationAdminNotification } from "@/lib/email";
import { notifyAdminsWithPermission } from "@/lib/notifications";
import { PERMISSIONS } from "@/lib/permissions";

type UploadedDocumentPayload = {
  url: string;
  publicId?: string;
  mimeType?: string;
  fileName?: string;
};

export async function POST(request: Request) {
  let body: {
    serviceType?: string;
    values?: Record<string, string>;
    documents?: Record<string, UploadedDocumentPayload>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { serviceType, values, documents } = body;
  if (!serviceType || !values) {
    return NextResponse.json({ error: "Missing application data." }, { status: 400 });
  }

  const config = getServiceApplicationConfig(serviceType);
  if (!config) {
    return NextResponse.json({ error: "Unknown service type." }, { status: 400 });
  }

  const schema = buildApplicationSchema(config.sections);
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your answers and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const documentRequirements = await getDocumentRequirements(config.type);

  const missingDocs = documentRequirements.filter((d) => d.required && !documents?.[d.id]?.url);
  if (missingDocs.length > 0) {
    return NextResponse.json(
      { error: `Please upload: ${missingDocs.map((d) => d.label).join(", ")}.` },
      { status: 400 }
    );
  }

  const contact = config.extractContact(parsed.data as Record<string, string>);
  if (!contact.name || !contact.email || !contact.phone) {
    return NextResponse.json({ error: "Missing applicant name, email, or phone." }, { status: 400 });
  }

  try {
    const referenceNumber = await generateReferenceNumber();

    const documentEntries = documentRequirements
      .filter((d) => documents?.[d.id]?.url)
      .map((d) => {
        const doc = documents![d.id];
        return {
          docType: d.id,
          label: d.label,
          fileUrl: doc.url,
          publicId: doc.publicId ?? null,
          mimeType: doc.mimeType ?? null,
        };
      });

    const application = await prisma.serviceApplication.create({
      data: {
        referenceNumber,
        serviceType: config.type,
        serviceTitle: config.title,
        applicantName: contact.name,
        applicantEmail: contact.email.toLowerCase(),
        applicantPhone: contact.phone,
        formData: parsed.data,
        documents: { create: documentEntries },
        statusHistory: {
          create: [{ status: "SUBMITTED", note: "Application submitted by client.", actorName: null }],
        },
      },
    });

    void sendApplicationConfirmationEmail({
      referenceNumber: application.referenceNumber,
      applicantName: application.applicantName,
      applicantEmail: application.applicantEmail,
      serviceTitle: application.serviceTitle,
    });
    void sendApplicationAdminNotification({
      id: application.id,
      referenceNumber: application.referenceNumber,
      applicantName: application.applicantName,
      applicantEmail: application.applicantEmail,
      serviceTitle: application.serviceTitle,
    });
    void notifyAdminsWithPermission(PERMISSIONS.VIEW_APPLICATIONS, {
      title: "New application submitted",
      body: `${application.applicantName} applied for ${application.serviceTitle} (${application.referenceNumber}).`,
      link: `/admin/applications/${application.id}`,
    });

    return NextResponse.json({ id: application.id, referenceNumber: application.referenceNumber }, { status: 201 });
  } catch (error) {
    console.error("[applications/submit] failed to save application:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
