import Link from "next/link";
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { siteContent } from "@/lib/data";
import { getContactInfo } from "@/lib/content";

export async function Footer() {
  const contact = await getContactInfo();

  return (
    <footer className="bg-forest-900 text-cream-100">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="font-display text-xl font-semibold text-cream-50">
              MariePrime Global Services
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-200/70">
              {siteContent.home.heroSubtext}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SocialIcon href={contact.socials.instagram} label="Instagram">
                <Instagram size={18} />
              </SocialIcon>
              <SocialIcon href={contact.socials.linkedin} label="LinkedIn">
                <Linkedin size={18} />
              </SocialIcon>
              <SocialIcon href={contact.socials.facebook} label="Facebook">
                <Facebook size={18} />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Navigate
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/" className="text-cream-200/80 hover:text-gold-300">Home</Link></li>
              <li><Link href="/about" className="text-cream-200/80 hover:text-gold-300">About</Link></li>
              <li><Link href="/services" className="text-cream-200/80 hover:text-gold-300">Services</Link></li>
              <li><Link href="/careers" className="text-cream-200/80 hover:text-gold-300">Careers</Link></li>
              <li><Link href="/blog" className="text-cream-200/80 hover:text-gold-300">Blog</Link></li>
              <li><Link href="/faq" className="text-cream-200/80 hover:text-gold-300">FAQ</Link></li>
              <li><Link href="/contact" className="text-cream-200/80 hover:text-gold-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-gold-400" />
                <a href={`mailto:${contact.email}`} className="hover:text-gold-300">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-gold-400" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-gold-300">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" />
                {contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream-50/10 pt-6 text-xs text-cream-200/50 md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} MariePrime Global Services Ltd. All rights reserved.
          </span>
          <span className="font-mono uppercase tracking-widest">
            Global Mobility &amp; Business Services
          </span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/15 text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-400"
    >
      {children}
    </a>
  );
}
