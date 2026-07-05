import Link from "next/link";
import { Instagram, Linkedin, Facebook, MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import { defaultHomeServices } from "@/lib/data";
import { getContactInfo } from "@/lib/content";
import { FooterNewsletterForm } from "@/components/layout/FooterNewsletterForm";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const contact = await getContactInfo();
  const footerServices = defaultHomeServices.slice(0, 7);

  return (
    <footer className="bg-forest-900 text-cream-100">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:px-10 lg:pt-14 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-6 lg:gap-8">
          {/* Company description + socials */}
          <div className="lg:col-span-2">
            <span className="font-display text-xl font-semibold text-cream-50">
              MariePrime Global Services
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-200/70">
              Your trusted partner for global travel, immigration and business solutions —
              from visa processing and flight bookings to logistics, procurement, and
              dedicated event and business support, delivered to one consistent standard.
            </p>

            <h4 className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Follow Us
            </h4>
            <div className="mt-4 flex items-center gap-3">
              <SocialIcon href={contact.socials.instagram} label="Instagram">
                <Instagram size={17} />
              </SocialIcon>
              <SocialIcon href={contact.socials.linkedin} label="LinkedIn">
                <Linkedin size={17} />
              </SocialIcon>
              <SocialIcon href={contact.socials.facebook} label="Facebook">
                <Facebook size={17} />
              </SocialIcon>
              <SocialIcon href={contact.socials.tiktok} label="TikTok">
                <TikTokIcon size={17} />
              </SocialIcon>
              <SocialIcon href={`https://wa.me/${contact.whatsapp}`} label="WhatsApp">
                <MessageCircle size={17} />
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream-200/80 hover:text-gold-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Services
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerServices.map((service) => (
                <li key={service.slug}>
                  <Link href="/services" className="text-cream-200/80 hover:text-gold-300">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch + working hours */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" />
                {contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-gold-400" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-gold-300">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-gold-400" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-gold-300">
                  {contact.phone}
                </a>
              </li>
            </ul>

            <h4 className="mt-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              <Clock size={13} />
              Working Hours
            </h4>
            <dl className="mt-4 space-y-3 text-sm leading-6">
              {contact.workingHours.map((row) => (
                <div key={row.days}>
                  <dt className="text-cream-200/80">{row.days}</dt>
                  <dd className="mt-0.5 font-medium text-cream-100/90">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Newsletter
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-cream-200/70">
              Occasional updates on travel, visas and business services. No spam.
            </p>
            <FooterNewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream-50/10 pt-6 text-xs text-cream-200/50 md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} MariePrime Global Services Ltd. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-gold-300">
              Terms &amp; Conditions
            </Link>
            <span className="font-mono uppercase tracking-widest">
              Global Mobility &amp; Business Services
            </span>
          </div>
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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/15 text-cream-100 transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:border-gold-400 hover:text-gold-400 active:scale-95"
    >
      {children}
    </a>
  );
}

/** Simple line-style TikTok mark, drawn to match the lucide icon stroke weight used elsewhere. */
export function TikTokIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 3.5c.5 2.4 2.1 4 4.5 4.3V11c-1.6.1-3.1-.4-4.5-1.3v6.4a5.6 5.6 0 1 1-4.8-5.5v3.1a2.5 2.5 0 1 0 1.8 2.4V3.5H16Z" />
    </svg>
  );
}
