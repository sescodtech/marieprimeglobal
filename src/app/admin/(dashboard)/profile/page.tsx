import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/permissions";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { AvatarUploader } from "@/components/admin/AvatarUploader";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { EmailSettingsForm } from "@/components/admin/EmailSettingsForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) redirect("/admin/login");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-forest-900">Profile</h1>
      <p className="mt-1 text-sm text-ink-500">
        {ROLE_LABELS[admin.role]} · {admin.email}
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5 sm:p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Profile picture</h2>
          <div className="mt-4">
            <AvatarUploader currentAvatarUrl={admin.avatarUrl} />
          </div>
        </div>

        <div className="rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5 sm:p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Personal information</h2>
          <div className="mt-4">
            <ProfileForm defaultName={admin.name} defaultPhone={admin.phone ?? ""} />
          </div>
        </div>

        <div className="rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5 sm:p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Password</h2>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </div>

        <div className="rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5 sm:p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">Email</h2>
          {admin.role === "SUPER_ADMIN" ? (
            <div className="mt-4">
              <EmailSettingsForm currentEmail={admin.email} currentRecoveryEmail={admin.recoveryEmail ?? ""} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-500">
              Your login email is <strong className="text-forest-900">{admin.email}</strong>. Ask a Super Admin to
              change it for you.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
