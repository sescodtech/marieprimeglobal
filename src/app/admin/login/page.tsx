import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { LockKeyhole } from "lucide-react";
import { ForgotPasswordLink } from "@/components/admin/ForgotPasswordLink";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const remember = formData.get("remember") === "on";
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");

  try {
    await signIn("credentials", {
      email,
      password,
      remember: remember ? "true" : "false",
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/admin/login?error=1&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
    throw error;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 px-6">
      <div className="w-full max-w-sm rounded-stub bg-cream-50 p-8 shadow-stub">
        <div className="flex items-center gap-2.5">
          <LockKeyhole size={20} className="text-forest-700" />
          <span className="font-display text-lg font-semibold text-forest-900">
            MariePrime Admin
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-500">Sign in to manage the site.</p>

        <form action={loginAction} className="mt-7 space-y-4">
          <input type="hidden" name="callbackUrl" value={params.callbackUrl || "/admin"} />
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-stub border border-forest-900/15 bg-cream-100 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
              placeholder="admin@marieprimeglobal.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-stub border border-forest-900/15 bg-cream-100 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {params.error && (
            <p className="text-sm text-red-600">
              Incorrect email or password. Please try again.
            </p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-ink-500">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-forest-900/25 text-forest-700 focus:ring-gold-500"
              />
              Remember me
            </label>
            <ForgotPasswordLink />
          </div>

          <button
            type="submit"
            className="w-full rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
