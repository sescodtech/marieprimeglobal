import { KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 px-6">
      <div className="w-full max-w-sm rounded-stub bg-cream-50 p-5 sm:p-8 shadow-stub">
        <div className="flex items-center gap-2.5">
          <KeyRound size={20} className="text-forest-700" />
          <span className="font-display text-lg font-semibold text-forest-900">
            Reset your password
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-500">
          Enter the email address on your admin account and we&apos;ll send you a link to reset
          your password.
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
