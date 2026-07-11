import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/actions/require-admin";
import { canManageRole, assignableRoles, PERMISSIONS } from "@/lib/permissions";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { ResetUserPasswordForm } from "@/components/admin/ResetUserPasswordForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);
  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) notFound();

  const isSelf = user.id === actor.id;
  if (!isSelf && !canManageRole(actor.role, actor.canManageAdmins, user.role)) {
    notFound();
  }

  const roles = assignableRoles(actor.role, actor.canManageAdmins);
  // Always include the user's current role in the option list, even if the
  // actor couldn't newly assign it, so the form never silently changes it.
  const roleOptions = roles.includes(user.role as (typeof roles)[number]) ? roles : [...roles, user.role];

  return (
    <div className="max-w-2xl">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to users
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Edit user</h1>

      <div className="mt-8 rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
        <EditUserForm
          userId={user.id}
          defaultName={user.name}
          defaultEmail={user.email}
          defaultRole={user.role}
          availableRoles={roleOptions}
          canEditRole={!isSelf}
        />
      </div>

      {!isSelf && (
        <div id="reset-password" className="mt-6 rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-semibold text-forest-900">Reset password</h2>
          <p className="mt-1 text-sm text-ink-500">Set a new password for {user.name}.</p>
          <div className="mt-5">
            <ResetUserPasswordForm userId={user.id} />
          </div>
        </div>
      )}
    </div>
  );
}
