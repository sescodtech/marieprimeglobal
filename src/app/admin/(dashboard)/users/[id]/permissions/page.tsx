import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/require-admin";
import { setUserPermissions } from "@/lib/actions/users";
import { getEffectivePermissions } from "@/lib/permissionGrants";
import { PermissionsEditor } from "@/components/admin/PermissionsEditor";
import type { Permission } from "@/lib/permissions";

export default async function UserPermissionsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) notFound();
  if (user.role === "SUPER_ADMIN") notFound(); // Super Admin is always unrestricted, nothing to configure

  const permissions = (await getEffectivePermissions(user.id, user.role)) as Permission[];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to users
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Permissions — {user.name}</h1>
      <p className="mt-1 text-sm text-ink-500">
        Choose exactly what {user.name} can see and do. Changes apply immediately, on their next action.
      </p>

      <div className="mt-8 rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-8">
        <PermissionsEditor userId={user.id} initialPermissions={permissions} onSave={setUserPermissions} />
      </div>
    </div>
  );
}
