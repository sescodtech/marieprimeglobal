import { KeyRound } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  const isValid = !!resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 px-6">
      <div className="w-full max-w-sm rounded-stub bg-cream-50 p-5 sm:p-8 shadow-stub">
        <div className="flex items-center gap-2.5">
          <KeyRound size={20} className="text-forest-700" />
          <span className="font-display text-lg font-semibold text-forest-900">
            Set a new password
          </span>
        </div>

        {isValid ? (
          <>
            <p className="mt-2 text-sm text-ink-500">Choose a new password for your account.</p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <div className="mt-4 space-y-4">
            <p className="rounded-stub bg-red-50 p-4 text-sm text-red-600">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/admin/forgot-password"
              className="block text-center text-sm font-semibold text-forest-700 hover:underline"
            >
              Request a new link →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
