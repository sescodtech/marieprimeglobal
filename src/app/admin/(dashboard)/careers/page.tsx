import Link from "next/link";
import { Plus, Pencil, Trash2, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteJobListing, toggleJobListingPublished } from "@/lib/actions/careers";

export default async function AdminCareersPage() {
  const jobs = await prisma.jobListing.findMany({ orderBy: { order: "asc" } });
  const applicationCount = await prisma.jobApplication.count();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Careers</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the open roles shown on the Careers page.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/careers/applications"
            className="inline-flex items-center gap-2 rounded-stub border border-forest-700/30 px-5 py-2.5 text-sm font-semibold text-forest-700 hover:border-forest-700 hover:bg-forest-700/5"
          >
            <Inbox size={16} />
            Applications
            {applicationCount > 0 && (
              <span className="rounded-full bg-forest-700 px-2 py-0.5 text-xs text-cream-50">
                {applicationCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/careers/new"
            className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
          >
            <Plus size={16} />
            Add role
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-900 text-cream-100">
            <tr>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Department</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-500">
                  No roles yet. Add your first one, or run the seed script.
                </td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-forest-900/5">
                <td className="px-5 py-4 font-mono text-xs text-ink-500">{job.department}</td>
                <td className="px-5 py-4 font-medium text-forest-900">{job.title}</td>
                <td className="px-5 py-4">
                  <form action={toggleJobListingPublished.bind(null, job.id, !job.isPublished)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${
                        job.isPublished
                          ? "bg-forest-700/10 text-forest-700"
                          : "bg-ink-500/10 text-ink-500"
                      }`}
                    >
                      {job.isPublished ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/careers/${job.id}`}
                      className="text-forest-700 hover:text-forest-900"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <form action={deleteJobListing.bind(null, job.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
