import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/require-admin";

export default async function PopupPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;
  const popup = await prisma.popup.findUnique({ where: { id } });
  if (!popup) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-lg shadow-2xl"
        style={{ backgroundColor: popup.bgColor, color: popup.textColor }}
      >
        {popup.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={popup.imageUrl} alt="" className="h-40 w-full object-cover" />
        )}
        <div className="p-8">
          {popup.subtitle && <p className="font-mono text-xs uppercase tracking-wider opacity-75">{popup.subtitle}</p>}
          <h2 className="mt-2 text-2xl font-semibold">{popup.title}</h2>
          {popup.description && <p className="mt-3 text-sm leading-relaxed opacity-90">{popup.description}</p>}
          {popup.buttonText && (
            <span className="mt-6 inline-flex items-center justify-center rounded-md bg-white/95 px-6 py-2.5 text-sm font-semibold text-black">
              {popup.buttonText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
