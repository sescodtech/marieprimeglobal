"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

/**
 * The public marketing Header/Footer/WhatsApp bubble were previously always
 * rendered around every route from the root layout — including /admin. That
 * meant the CMS got the public site's nav bar and footer stacked on top of
 * its own sidebar, which is what made the admin dashboard feel so cramped
 * and confusing on mobile (two navs, two hamburgers, a giant footer under
 * every CMS page). /admin has its own header/sidebar, so it opts out here.
 */
export function SiteChrome({
  children,
  whatsapp,
  logoUrl,
}: {
  children: React.ReactNode;
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
      <Footer />
      <FloatingWhatsApp whatsapp={whatsapp} />
    </>
  );
}
