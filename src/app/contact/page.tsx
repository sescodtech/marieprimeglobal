import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Linkedin, Facebook } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { getContactInfo, getSeoSetting } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { TikTokIcon } from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("contact");
  return {
    title: seo?.metaTitle ?? "Contact Us",
    description:
      seo?.metaDescription ??
      "Reach MariePrime Global Services by form, email, phone or WhatsApp for flight booking, visa, study abroad, business registration and investment enquiries.",
    alternates: { canonical: "/contact" },
    openGraph: seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
  };
}

export default async function ContactPage() {
  const contact = await getContactInfo();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "TravelAgency",
      name: "MariePrime Global Services",
      email: contact.email,
      telephone: contact.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address,
        addressCountry: "NG",
      },
    },
  };

  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <JsonLd data={contactSchema} />
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-medium leading-tight text-forest-900 sm:text-5xl">
            Let's get your request started.
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Contact details */}
          <Reveal>
            <div className="rounded-stub bg-forest-900 p-8 text-cream-50 sm:p-9">
              <h2 className="font-display text-xl font-semibold">Reach us directly</h2>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-gold-400" />
                  <a href={`mailto:${contact.email}`} className="hover:text-gold-300">
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={17} className="mt-0.5 shrink-0 text-gold-400" />
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-gold-300">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-gold-400" />
                  {contact.address}
                </li>
              </ul>

              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-stub bg-gold-500 px-6 py-3 text-sm font-semibold text-forest-900 transition-colors hover:bg-gold-400"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>

              <div className="mt-8 flex items-center gap-3 border-t border-cream-50/10 pt-6">
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
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5 sm:p-9">
              <h2 className="font-display text-xl font-semibold text-forest-900">
                Send an enquiry
              </h2>
              <p className="mt-1.5 text-sm text-ink-500">
                We typically respond within 24–48 hours.
              </p>
              <div className="mt-7">
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
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
