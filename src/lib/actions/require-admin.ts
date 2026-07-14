"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasGrantedPermission, SUPER_ADMIN_ONLY_PERMISSIONS } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";
import { getEffectivePermissions } from "@/lib/permissionGrants";

/**
 * Call at the top of every admin-only Server Action (create/update/delete
 * mutations reachable from the admin dashboard). Server Actions are exposed
 * as their own POST endpoints, so they must not rely solely on middleware —
 * this is the defense-in-depth check that ensures a request without a valid
 * session can never run an admin mutation, no matter how the action is
 * invoked.
 *
 * This also re-checks the Admin row's current `status` on every call — not
 * just the JWT session — so a Super Admin suspending someone takes effect
 * immediately, even if that person's session was issued before they were
 * suspended and hasn't expired yet.
 *
 * Also resolves and returns the account's *current* permission grants
 * (Phase 3.5) — Super Admin gets everything; Admin/Staff get whatever's in
 * AdminPermissionGrant right now, so a permission change takes effect on
 * the very next request, no redeploy or re-login needed.
 *
 * Do NOT use this on actions that are also called from public-facing pages
 * (e.g. the newsletter signup form or the public contact/enquiry form).
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin || admin.status === "SUSPENDED") {
    redirect("/admin/login");
  }

  const permissions = await getEffectivePermissions(admin.id, admin.role);

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    canManageAdmins: admin.canManageAdmins,
    permissions,
  };
}

/** Same as requireAdmin(), but also requires a specific permission — checked
 *  against the account's real, current grants, not a hardcoded role map.
 *  Permissions in SUPER_ADMIN_ONLY_PERMISSIONS can never be satisfied by a
 *  grant, only by the role itself, as a defense-in-depth backstop. */
export async function requirePermission(permission: Permission) {
  const admin = await requireAdmin();

  if (SUPER_ADMIN_ONLY_PERMISSIONS.includes(permission)) {
    if (admin.role !== "SUPER_ADMIN") redirect("/admin?error=unauthorized");
    return admin;
  }

  if (admin.role !== "SUPER_ADMIN" && !hasGrantedPermission(admin.permissions, permission)) {
    redirect("/admin?error=unauthorized");
  }
  return admin;
}

/** Same as requireAdmin(), but only a Super Admin may proceed. */
export async function requireSuperAdmin() {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    redirect("/admin?error=unauthorized");
  }
  return admin;
}
