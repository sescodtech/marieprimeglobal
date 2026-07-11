import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getServiceApplicationConfig } from "@/lib/applicationForms/config";
import { STATUS_LABELS, statusBadgeClass } from "@/lib/applicationForms/status";
import { StatusUpdateForm } from "@/components/admin/applications/StatusUpdateForm";
import { RequestDocsForm } from "@/components/admin/applications/RequestDocsForm";
import { AddNoteForm } from "@/components/admin/applications/AddNoteForm";
import { AssignStaffSelect } from "@/components/admin/applications/AssignStaffSelect";
import { PrintButton } from "@/components/admin/applications/PrintButton";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const application = await prisma.serviceApplication.findUnique({
    where: { id },
    include: {
      documents: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      assignedStaff: { select: { id: true, name: true } },
    },
  });
  if (!application) notFound();

  const role = session.user.role;
  const canReviewAll = hasPermission(role, PERMISSIONS.REVIEW_APPLICATIONS);
  const canViewAssignedOnly = hasPermission(role, PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS);
  const isAssignedToMe = application.assignedStaffId === session.user.id;

  if (!canReviewAll && !(canViewAssignedOnly && isAssignedToMe)) {
    redirect("/admin/applications?error=unauthorized");
  }

  const config = getServiceApplicationConfig(application.serviceType);
  const formValues = (application.formData ?? {}) as Record<string, string>;

  const staffOptions = canReviewAll
    ? (
        await prisma.admin.findMany({
          where: { role: { in: ["SUPER_ADMIN", "ADMIN", "STAFF"] }, status: "ACTIVE" },
          orderBy: { name: "asc" },
          select: { id: true, name: true, role: true },
        })
      ).map((s) => ({ id: s.id, name: s.name, role: s.role }))
    : [];

  return (
    <div>
      <Link href="/admin/applications" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700 print:hidden">
        <ArrowLeft size={15} />
        Back to applications
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-500">{application.referenceNumber}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-forest-900">{application.serviceTitle}</h1>
          <p className="mt-1 text-sm text-ink-500">
            {application.applicantName} · {application.applicantEmail} · {application.applicantPhone}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${statusBadgeClass(application.status)}`}>
            {STATUS_LABELS[application.status]}
          </span>
          <PrintButton />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column: applicant info + documents */}
        <div className="space-y-6 lg:col-span-2">
          {config?.sections.map((section) => (
            <div key={section.id} className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">{section.title}</h2>
              <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {section.fields
                  .filter((f) => formValues[f.id])
                  .map((field) => (
                    <div key={field.id}>
                      <dt className="text-xs text-ink-500">{field.label}</dt>
                      <dd className="text-sm text-forest-900">{formValues[field.id]}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          ))}

          <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 print:hidden">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Documents</h2>
            {application.documents.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">No documents uploaded.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {application.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-3 rounded-stub bg-cream-100 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm text-forest-900">
                      <FileText size={15} className="text-forest-700" />
                      {doc.label}
                    </span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:underline"
                    >
                      <Download size={13} />
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 print:hidden">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Notes</h2>
            <div className="mt-3 space-y-3">
              {application.notes.length === 0 && <p className="text-sm text-ink-500">No notes yet.</p>}
              {application.notes.map((note) => (
                <div key={note.id} className="rounded-stub bg-cream-100 p-3">
                  <p className="text-sm text-forest-900">{note.body}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {note.authorName} · {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(note.createdAt)}
                    {note.isPublic && <span className="ml-2 rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold-600">Public</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <AddNoteForm applicationId={application.id} />
            </div>
          </div>
        </div>

        {/* Right column: status, assignment, actions, timeline */}
        <div className="space-y-6 print:hidden">
          <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Update Status</h2>
            <div className="mt-3">
              <StatusUpdateForm
                applicationId={application.id}
                currentStatus={application.status}
                canSetTerminal={canReviewAll}
              />
            </div>
          </div>

          {canReviewAll && (
            <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">
                Request Additional Documents
              </h2>
              <div className="mt-3">
                <RequestDocsForm applicationId={application.id} />
              </div>
            </div>
          )}

          {canReviewAll && (
            <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Assigned Staff</h2>
              <div className="mt-3">
                <AssignStaffSelect
                  applicationId={application.id}
                  currentStaffId={application.assignedStaffId}
                  staffOptions={staffOptions}
                />
              </div>
            </div>
          )}

          <div className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Status History</h2>
            <ol className="mt-3 space-y-4 border-l border-forest-900/10 pl-4">
              {application.statusHistory.map((event) => (
                <li key={event.id}>
                  <p className="text-sm font-medium text-forest-900">{STATUS_LABELS[event.status]}</p>
                  {event.note && <p className="text-sm text-ink-500">{event.note}</p>}
                  <p className="text-xs text-ink-500">
                    {event.actorName ?? "System"} ·{" "}
                    {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(event.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
