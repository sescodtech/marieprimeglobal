import { prisma } from "@/lib/prisma";
import { ALL_PERMISSIONS, DEFAULT_PERMISSIONS_BY_ROLE, type Permission } from "@/lib/permissions";

/**
 * The single source of truth for what an account can actually do right now.
 * Super Admin always gets everything (hardcoded, by design — see
 * permissions.ts). ADMIN and STAFF get whatever's in AdminPermissionGrant,
 * which a Super Admin manages from /admin/users/[id]/permissions — no
 * redeploy needed for a permission change to take effect.
 */
export async function getEffectivePermissions(adminId: string, role: string): Promise<Permission[]> {
  if (role === "SUPER_ADMIN") return ALL_PERMISSIONS;

  const grants = await prisma.adminPermissionGrant.findMany({ where: { adminId } });
  return grants.map((g) => g.permission as Permission);
}

/** Seeds a newly-created ADMIN or STAFF account with the sensible defaults
 *  for that role — a Super Admin can adjust from there. Never called for
 *  SUPER_ADMIN, which needs no grant rows. */
export async function seedDefaultPermissions(adminId: string, role: "ADMIN" | "STAFF") {
  const defaults = DEFAULT_PERMISSIONS_BY_ROLE[role];
  if (defaults.length === 0) return;
  await prisma.adminPermissionGrant.createMany({
    data: defaults.map((permission) => ({ adminId, permission })),
    skipDuplicates: true,
  });
}

export async function setPermissions(adminId: string, permissions: Permission[]) {
  await prisma.$transaction([
    prisma.adminPermissionGrant.deleteMany({ where: { adminId } }),
    prisma.adminPermissionGrant.createMany({
      data: permissions.map((permission) => ({ adminId, permission })),
      skipDuplicates: true,
    }),
  ]);
}
