import { Trash2, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteSubscriber } from "@/lib/actions/newsletter";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Newsletter</h1>
          <p className="mt-1 text-sm text-ink-500">
            {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"} collected from the
            blog signup form.
          </p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`mailto:?bcc=${subscribers.map((s) => s.email).join(",")}`}
            className="inline-flex items-center gap-2 rounded-stub border border-forest-700/30 px-5 py-2.5 text-sm font-semibold text-forest-700 hover:border-forest-700 hover:bg-forest-700/5"
          >
            <Mail size={16} />
            Email all
          </a>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-stub bg-cream-50 shadow-card ring-1 ring-forest-900/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-900 text-cream-100">
            <tr>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider">Subscribed</th>
              <th className="px-5 py-3 font-mono text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-ink-500">
                  No subscribers yet.
                </td>
              </tr>
            )}
            {subscribers.map((sub) => (
              <tr key={sub.id} className="border-t border-forest-900/5">
                <td className="px-5 py-4 font-medium text-forest-900">{sub.email}</td>
                <td className="px-5 py-4 text-ink-500">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <form action={deleteSubscriber.bind(null, sub.id)}>
                    <button type="submit" className="text-red-500 hover:text-red-700" aria-label="Remove">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
