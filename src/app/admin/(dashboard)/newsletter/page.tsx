import { format } from "date-fns";
import { Download, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { deleteSubscriber, setSubscriberStatus } from "@/lib/actions/newsletter";
import { ImportSubscribersForm } from "@/components/admin/ImportSubscribersForm";
import { ComposeNewsletterForm } from "@/components/admin/ComposeNewsletterForm";
import { NewsletterActions } from "@/components/admin/NewsletterActions";

const NEWSLETTER_STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-ink-500/10 text-ink-500",
  SCHEDULED: "bg-gold-500/20 text-gold-600",
  SENDING: "bg-blue-500/10 text-blue-600",
  SENT: "bg-forest-700/10 text-forest-700",
  FAILED: "bg-red-500/10 text-red-600",
};

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission(PERMISSIONS.MANAGE_SUBSCRIBERS);
  const { q, status } = await searchParams;

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: {
      ...(status && status !== "ALL" ? { status: status as "SUBSCRIBED" | "UNSUBSCRIBED" } : {}),
      ...(q?.trim()
        ? { OR: [{ email: { contains: q.trim(), mode: "insensitive" } }, { name: { contains: q.trim(), mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const newsletters = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Newsletter</h1>
      <p className="mt-1 text-sm text-ink-500">Manage subscribers and send campaigns via Resend.</p>

      {/* Subscribers */}
      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-forest-900">
            Subscribers <span className="text-sm font-normal text-ink-500">({subscribers.length})</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <ImportSubscribersForm />
            <a
              href="/api/admin/newsletter/subscribers/export"
              className="inline-flex items-center gap-2 rounded-stub border border-forest-700/25 px-4 py-2 text-xs font-semibold text-forest-700 hover:border-forest-700"
            >
              <Download size={14} />
              Export CSV
            </a>
          </div>
        </div>

        <form method="GET" className="mt-4 flex flex-wrap items-center gap-2">
          <input type="text" name="q" defaultValue={q} placeholder="Search email or name…" className="input max-w-xs" />
          <select name="status" defaultValue={status || "ALL"} className="input max-w-[160px]">
            <option value="ALL">All</option>
            <option value="SUBSCRIBED">Subscribed</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
          </select>
          <button type="submit" className="rounded-stub bg-forest-700 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
            Filter
          </button>
        </form>

        <div className="mt-4 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-forest-900 text-cream-100">
                <tr>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-ink-500">No subscribers found.</td>
                  </tr>
                )}
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-t border-forest-900/5">
                    <td className="px-5 py-3 text-forest-900">{s.email}</td>
                    <td className="px-5 py-3 text-ink-500">{s.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${s.status === "SUBSCRIBED" ? "bg-forest-700/10 text-forest-700" : "bg-ink-500/10 text-ink-500"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-3">
                        <form action={setSubscriberStatus.bind(null, s.id, s.status === "SUBSCRIBED" ? "UNSUBSCRIBED" : "SUBSCRIBED")}>
                          <button type="submit" className="text-xs font-medium text-forest-700 hover:underline">
                            {s.status === "SUBSCRIBED" ? "Unsubscribe" : "Resubscribe"}
                          </button>
                        </form>
                        <form action={deleteSubscriber.bind(null, s.id)}>
                          <button type="submit" className="text-red-500 hover:text-red-700" title="Delete">
                            <Trash2 size={14} />
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
      </section>

      {/* Compose */}
      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold text-forest-900">Compose newsletter</h2>
        <div className="mt-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-8">
          <ComposeNewsletterForm />
        </div>
      </section>

      {/* History */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-forest-900">History</h2>
        <div className="mt-4 space-y-3">
          {newsletters.length === 0 && <p className="text-sm text-ink-500">No newsletters yet.</p>}
          {newsletters.map((n) => (
            <div key={n.id} className="rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-forest-900">{n.subject}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {n.status === "SENT" && `Sent ${format(n.sentAt ?? n.createdAt, "MMM d, yyyy h:mm a")} — ${n.sentCount} sent, ${n.failedCount} failed`}
                    {n.status === "SCHEDULED" && n.scheduledFor && `Scheduled for ${format(n.scheduledFor, "MMM d, yyyy h:mm a")}`}
                    {n.status === "DRAFT" && `Created ${format(n.createdAt, "MMM d, yyyy")}`}
                    {n.status === "SENDING" && "Sending…"}
                    {n.status === "FAILED" && "Failed to send"}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${NEWSLETTER_STATUS_STYLES[n.status]}`}>
                  {n.status}
                </span>
              </div>
              {n.status === "DRAFT" && (
                <div className="mt-4">
                  <NewsletterActions id={n.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
