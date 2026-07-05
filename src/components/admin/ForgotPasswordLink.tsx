import Link from "next/link";

export function ForgotPasswordLink() {
  return (
    <Link href="/admin/forgot-password" className="text-sm font-medium text-forest-700 hover:underline">
      Forgot password?
    </Link>
  );
}
