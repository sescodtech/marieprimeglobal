"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Call at the top of every admin-only Server Action (create/update/delete
 * mutations reachable from the admin dashboard). Server Actions are exposed
 * as their own POST endpoints, so they must not rely solely on middleware —
 * this is the defense-in-depth check that ensures a request without a valid
 * session can never run an admin mutation, no matter how the action is
 * invoked.
 *
 * Do NOT use this on actions that are also called from public-facing pages
 * (e.g. the newsletter signup form or the public contact/enquiry form).
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}
