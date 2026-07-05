"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

/**
 * The public marketing Header/Footer/WhatsApp bubble were previously always
 * rendered around every route from the root layout — including /admin. That
 * meant the CMS got the public site's nav bar and footer stacked on top of
 * its own sidebar, which is what made the admin dashboard feel so cramped
 * and confusing on mobile (two navs, two hamburgers, a giant footer under
 * every CMS page). /admin has its own header/sidebar, so it opts out here.
 *
 * NOTE: Footer is an async Server Component (it reads from Prisma/fs via
 * lib/content.ts). It must NOT be imported directly into this "use client"
 * file — that would force webpack to bundle it (and `fs`) for the browser
 * and break the build. Instead, the server-side RootLayout renders <Footer />
 * and passes the resulting element down here as a prop, exactly like
 * `children`.
 */
export function SiteChrome({
  children,
  footer,
  whatsapp,
  logoUrl,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  whatsapp: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header whatsapp={whatsapp} logoUrl={logoUrl} />
      <main>{children}</main>
      {footer}
      <FloatingWhatsApp whatsapp={whatsapp} />
    </>
  );
}
