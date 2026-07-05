import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 px-6">
      <div className="w-full max-w-sm rounded-stub bg-cream-50 p-5 sm:p-8 shadow-stub">
        <div className="flex items-center gap-2.5">
          <LockKeyhole size={20} className="text-forest-700" />
          <span className="font-display text-lg font-semibold text-forest-900">
            MariePrime Admin
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-500">Sign in to manage the site.</p>

        <LoginForm callbackUrl={params.callbackUrl || "/admin"} />
      </div>
    </div>
  );
}
