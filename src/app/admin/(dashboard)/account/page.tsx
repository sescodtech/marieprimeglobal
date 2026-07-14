import { redirect } from "next/navigation";

// Superseded by the fuller Profile page (Phase 3.5) — redirect so any old
// bookmarks/links to /admin/account keep working.
export default function AccountPage() {
  redirect("/admin/profile");
}
