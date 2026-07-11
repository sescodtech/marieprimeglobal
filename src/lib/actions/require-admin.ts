"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";

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

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    canManageAdmins: admin.canManageAdmins,
  };
}

/** Same as requireAdmin(), but also requires a specific permission. */
export async function requirePermission(permission: Permission) {
  const admin = await requireAdmin();
  if (!hasPermission(admin.role, permission)) {
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
