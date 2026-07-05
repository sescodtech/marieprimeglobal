import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function AccountPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Account</h1>
      <p className="mt-1 text-sm text-ink-500">Change your admin password.</p>

      <div className="mt-8 max-w-md rounded-stub bg-cream-50 p-5 sm:p-8 shadow-card ring-1 ring-forest-900/5">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
