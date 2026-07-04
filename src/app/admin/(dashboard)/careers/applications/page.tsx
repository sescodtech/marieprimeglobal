import Link from "next/link";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateApplicationStatus, deleteApplication } from "@/lib/actions/jobApplications";
import { ApplicationStatusSelect } from "@/components/admin/ApplicationStatusSelect";

const statusStyles: Record<string, string> = {
  NEW: "bg-forest-700/10 text-forest-700",
  REVIEWED: "bg-gold-500/15 text-gold-700",
  SHORTLISTED: "bg-forest-700 text-cream-50",
  REJECTED: "bg-ink-500/10 text-ink-500",
};

export default async function AdminApplicationsPage() {
  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700"
      >
        <ArrowLeft size={15} />
        Back to careers
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Applications</h1>
          <p className="mt-1 text-sm text-ink-500">
            Every application submitted through the Careers page, with CV and cover letter links.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {applications.length === 0 && (
          <div className="rounded-stub bg-cream-50 p-8 text-center text-ink-500 shadow-card ring-1 ring-forest-900/5">
            No applications yet.
          </div>
        )}

        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest-700">
                  {app.jobTitle}
                </span>
                <h2 className="mt-1 font-display text-lg font-semibold text-forest-900">
                  {app.fullName}
                </h2>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                  <span>{app.email}</span>
                  <span>{app.phone}</span>
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ApplicationStatusSelect
                  currentStatus={app.status}
                  action={updateApplicationStatus.bind(null, app.id)}
                />
                <form action={deleteApplication.bind(null, app.id)}>
                  <button type="submit" className="text-red-500 hover:text-red-700" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>

            {app.message && (
              <p className="mt-4 text-sm leading-relaxed text-ink-700">{app.message}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-4 border-t border-forest-900/5 pt-4">
              <a
                href={app.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 hover:text-forest-900"
              >
                <FileText size={14} />
                View CV
              </a>
              {app.coverLetterUrl && (
                <a
                  href={app.coverLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 hover:text-forest-900"
                >
                  <FileText size={14} />
                  View cover letter
                </a>
              )}
              <span
                className={`ml-auto rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${statusStyles[app.status]}`}
              >
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
