import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getDocumentRequirements } from "@/lib/applicationForms/documents";
import { ReuploadForm } from "@/components/apply/ReuploadForm";

export const metadata: Metadata = {
  title: "Upload Documents",
  robots: { index: false, follow: false },
};

export default async function UploadLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const application = await prisma.serviceApplication.findUnique({
    where: { uploadToken: token },
    include: {
      documents: true,
      statusHistory: { orderBy: { createdAt: "desc" }, take: 1, where: { status: "ADDITIONAL_DOCS_REQUIRED" } },
    },
  });

  const isValid = application && application.uploadTokenExpiresAt && application.uploadTokenExpiresAt > new Date();

  if (!isValid) {
    return (
      <section className="bg-cream-100 py-20">
        <div className="mx-auto max-w-lg px-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-forest-900">This link is no longer valid</h1>
          <p className="mt-3 text-sm text-ink-500">
            It may have expired or already been used. Please contact us and we'll send a new one.
          </p>
        </div>
      </section>
    );
  }

  const documents = await getDocumentRequirements(application.serviceType);
  const existing = Object.fromEntries(
    application.documents.map((d) => [d.docType, { url: d.fileUrl, mimeType: d.mimeType, fileName: d.label }])
  );
  const note = application.statusHistory[0]?.note;

  return (
    <>
      <section className="bg-forest-900 py-16 text-cream-50 lg:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <Reveal>
            <Eyebrow light className="justify-center">
              {application.referenceNumber}
            </Eyebrow>
            <h1 className="mt-5 font-display text-3xl font-medium leading-tight sm:text-4xl">
              Upload the requested documents
            </h1>
            {note && <p className="mx-auto mt-4 max-w-xl text-sm text-cream-200/80">{note}</p>}
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-10">
          <Reveal>
            <ReuploadForm token={token} serviceType={application.serviceType} documents={documents} existing={existing} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
