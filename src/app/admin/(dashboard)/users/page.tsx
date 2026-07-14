import Link from "next/link";
import { Plus, Pencil, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { canManageRole, PERMISSIONS, ROLE_LABELS } from "@/lib/permissions";
import { deleteUser, setUserStatus, setCanManageAdmins } from "@/lib/actions/users";

export default async function AdminUsersPage() {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);
  const users = await prisma.admin.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Users</h1>
          <p className="mt-1 text-sm text-ink-500">Manage Admin and Staff accounts and their access.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center justify-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          <Plus size={16} />
          Add user
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {users.map((u) => {
          const isSelf = u.id === actor.id;
          const manageable = !isSelf && canManageRole(actor.role, actor.canManageAdmins, u.role);

          return (
            <div
              key={u.id}
              className="flex flex-col gap-4 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-semibold text-forest-900">{u.name}</span>
                  {isSelf && (
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-600">
                      You
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{u.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-forest-700/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-forest-700">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                  {u.role === "ADMIN" && u.canManageAdmins && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-gold-600">
                      <ShieldCheck size={11} />
                      Can manage Admins
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
                      u.status === "ACTIVE" ? "bg-forest-700/10 text-forest-700" : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {u.status === "ACTIVE" ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>

              {manageable && (
                <div className="flex shrink-0 flex-row flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/users/${u.id}`} className="text-forest-700 hover:text-forest-900" title="Edit">
                      <Pencil size={16} />
                    </Link>
                    {actor.role === "SUPER_ADMIN" && u.role !== "SUPER_ADMIN" && (
                      <Link
                        href={`/admin/users/${u.id}/permissions`}
                        className="text-forest-700 hover:text-forest-900"
                        title="Permissions"
                      >
                        <ShieldCheck size={16} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/users/${u.id}#reset-password`}
                      className="text-forest-700 hover:text-forest-900"
                      title="Reset password"
                    >
                      <KeyRound size={16} />
                    </Link>
                    <form action={deleteUser.bind(null, u.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                  <form action={setUserStatus.bind(null, u.id, u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${
                        u.status === "ACTIVE" ? "bg-ink-500/10 text-ink-500" : "bg-forest-700/10 text-forest-700"
                      }`}
                    >
                      {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </button>
                  </form>
                  {actor.role === "SUPER_ADMIN" && u.role === "ADMIN" && (
                    <form action={setCanManageAdmins.bind(null, u.id, !u.canManageAdmins)}>
                      <button type="submit" className="text-xs font-medium text-forest-700 hover:underline">
                        {u.canManageAdmins ? "Revoke admin management" : "Grant admin management"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
