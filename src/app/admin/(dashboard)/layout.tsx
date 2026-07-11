import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 font-body lg:flex-row">
      <AdminSidebar role={session?.user?.role} />
      {/* min-w-0 stops a wide child (e.g. a table) from stretching this flex
          item and forcing the whole page to scroll horizontally. */}
      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
