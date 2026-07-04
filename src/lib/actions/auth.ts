"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signOut } from "@/lib/auth";

export async function signOutAction() {
  try {
    await signOut({ redirectTo: "/admin/login" });
  } catch (error) {
    // signOut() intentionally throws a special "redirect" error to hand
    // control back to Next.js — let that one through. Anything else means
    // the sign-out itself failed, so fail safe to the login page instead of
    // leaving the user on a blank page or dead route.
    if (isRedirectError(error)) throw error;
    console.error("[signOutAction] Sign out failed:", error);
    redirect("/admin/login");
  }
}
