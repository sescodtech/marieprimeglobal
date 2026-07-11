import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission } from "@/lib/actions/require-admin";
import { assignableRoles, PERMISSIONS } from "@/lib/permissions";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

export default async function NewUserPage() {
  const actor = await requirePermission(PERMISSIONS.MANAGE_STAFF);
  const roles = assignableRoles(actor.role, actor.canManageAdmins);

  return (
    <div>
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to users
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Add user</h1>
      <p className="mt-1 text-sm text-ink-500">They'll sign in with the email and temporary password you set here.</p>

      <div className="mt-8 max-w-2xl rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
        <CreateUserForm availableRoles={roles} />
      </div>
    </div>
  );
}
