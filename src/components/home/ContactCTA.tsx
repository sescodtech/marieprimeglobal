import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getContactInfo } from "@/lib/content";

export async function ContactCTA() {
  const contact = await getContactInfo();

  return (
    <section className="bg-forest-900 pt-24 pb-10 text-cream-50 lg:pt-28 lg:pb-14">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
            Tell us what you're trying to get done.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream-200/70">
            Send us the details and a MariePrime representative will respond with next steps,
            typically within 24–48 hours.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="secondary">
              Submit an enquiry
            </Button>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-stub border border-cream-50/25 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:border-gold-400 hover:bg-cream-50/5"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
