import Link from "next/link";
import { Plus, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { deleteService, toggleServicePublished, toggleServiceArchived } from "@/lib/actions/services";

const APPLICATION_MODE_LABELS: Record<string, string> = {
  ONLINE_APPLICATION: "Online Application",
  ENQUIRY_ONLY: "Enquiry Only",
};

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  await requirePermission(PERMISSIONS.MANAGE_SERVICES);
  const { archived } = await searchParams;
  const showArchived = archived === "1";

  const services = await prisma.service.findMany({
    where: showArchived ? {} : { isArchived: false },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Services</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage the services shown on the Home and Services pages, including each one's
            dedicated detail page content and application mode.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={showArchived ? "/admin/services" : "/admin/services?archived=1"}
            className="text-sm font-medium text-ink-500 hover:text-forest-700"
          >
            {showArchived ? "Hide archived" : "Show archived"}
          </Link>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
          >
            <Plus size={16} />
            Add service
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-forest-900 text-cream-100">
            <tr>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Route</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Application Mode</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-500">
                  No services yet. Add your first one, or run the seed script.
                </td>
              </tr>
            )}
            {services.map((service) => (
              <tr key={service.id} className="border-t border-forest-900/5">
                <td className="px-5 py-4 font-mono text-xs text-ink-500">{service.routeCode}</td>
                <td className="px-5 py-4 font-medium text-forest-900">
                  {service.title}
                  {service.isArchived && (
                    <span className="ml-2 rounded-full bg-ink-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-500">
                      Archived
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-xs text-ink-500">{APPLICATION_MODE_LABELS[service.applicationMode]}</td>
                <td className="px-5 py-4">
                  <form action={toggleServicePublished.bind(null, service.id, !service.isPublished)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${
                        service.isPublished
                          ? "bg-forest-700/10 text-forest-700"
                          : "bg-ink-500/10 text-ink-500"
                      }`}
                    >
                      {service.isPublished ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="text-forest-700 hover:text-forest-900"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <form action={toggleServiceArchived.bind(null, service.id, !service.isArchived)}>
                      <button
                        type="submit"
                        className="text-ink-500 hover:text-forest-700"
                        aria-label={service.isArchived ? "Unarchive" : "Archive"}
                        title={service.isArchived ? "Unarchive" : "Archive"}
                      >
                        {service.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                      </button>
                    </form>
                    <form action={deleteService.bind(null, service.id)}>
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
    </div>
  );
}
