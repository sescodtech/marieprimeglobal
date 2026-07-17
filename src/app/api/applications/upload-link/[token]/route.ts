import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDocumentRequirements } from "@/lib/applicationForms/documents";
import { sendApplicationStatusUpdateEmail } from "@/lib/email";
import { notifyAdminsWithPermission, createNotification } from "@/lib/notifications";
import { PERMISSIONS } from "@/lib/permissions";
import { STATUS_LABELS } from "@/lib/applicationForms/status";
import { logAudit } from "@/lib/audit";

type UploadedDocumentPayload = { url: string; publicId?: string; mimeType?: string; fileName?: string };

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const application = await prisma.serviceApplication.findUnique({ where: { uploadToken: token } });
  if (!application || !application.uploadTokenExpiresAt || application.uploadTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: "This upload link is no longer valid." }, { status: 410 });
  }

  let body: { documents?: Record<string, UploadedDocumentPayload> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const documents = body.documents ?? {};
  if (Object.keys(documents).length === 0) {
    return NextResponse.json({ error: "Please upload at least one document." }, { status: 400 });
  }

  const requirements = await getDocumentRequirements(application.serviceType);
  const requirementByKey = new Map(requirements.map((r) => [r.id, r]));

  await prisma.$transaction(
    Object.entries(documents)
      .filter(([docKey]) => requirementByKey.has(docKey))
      .map(([docKey, doc]) =>
        prisma.applicationDocument.upsert({
          where: { applicationId_docType: { applicationId: application.id, docType: docKey } },
          create: {
            applicationId: application.id,
            docType: docKey,
            label: requirementByKey.get(docKey)!.label,
            fileUrl: doc.url,
            publicId: doc.publicId ?? null,
            mimeType: doc.mimeType ?? null,
          },
          update: {
            fileUrl: doc.url,
            publicId: doc.publicId ?? null,
            mimeType: doc.mimeType ?? null,
          },
        })
      )
  );

  await prisma.$transaction([
    prisma.serviceApplication.update({ where: { id: application.id }, data: { status: "DOCUMENTS_RECEIVED" } }),
    prisma.applicationStatusEvent.create({
      data: {
        applicationId: application.id,
        status: "DOCUMENTS_RECEIVED",
        note: "Client uploaded additional documents.",
        actorName: null,
      },
    }),
  ]);

  void sendApplicationStatusUpdateEmail({
    referenceNumber: application.referenceNumber,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    serviceTitle: application.serviceTitle,
    statusLabel: STATUS_LABELS.DOCUMENTS_RECEIVED,
  });

  await logAudit({
    actor: null,
    action: "DOCUMENT_UPLOADED",
    entityType: "ServiceApplication",
    entityId: application.id,
    description: `${application.applicantName} uploaded additional documents for ${application.referenceNumber} via the secure link.`,
  });

  if (application.assignedStaffId) {
    void createNotification({
      recipientAdminId: application.assignedStaffId,
      title: "Documents received",
      body: `${application.referenceNumber} — the client uploaded the requested documents.`,
      link: `/admin/applications/${application.id}`,
      category: "DOCUMENTS",
    });
  } else {
    void notifyAdminsWithPermission(PERMISSIONS.VIEW_APPLICATIONS, {
      title: "Documents received",
      body: `${application.referenceNumber} — the client uploaded the requested documents.`,
      link: `/admin/applications/${application.id}`,
      category: "DOCUMENTS",
    });
  }

  return NextResponse.json({ ok: true });
}
