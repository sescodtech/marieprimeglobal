import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-stub px-3 py-2.5 text-sm font-medium text-cream-200/75 transition-colors hover:bg-cream-50/5 hover:text-cream-50"
      >
        <LogOut size={17} />
        Sign out
      </button>
    </form>
  );
}
