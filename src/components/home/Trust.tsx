import { ShieldCheck, Lock, Users2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const indicators = [
  {
    icon: ShieldCheck,
    label: "Registered & compliant",
    description: "Operating under registered business credentials, verifiable on request.",
  },
  {
    icon: Lock,
    label: "Documents handled securely",
    description: "Your paperwork is stored and transmitted through controlled channels only.",
  },
  {
    icon: Users2,
    label: "Direct human contact",
    description: "One dedicated representative — never a rotating support queue.",
  },
];

export function Trust() {
  return (
    <section className="border-y border-forest-900/10 bg-cream-50 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 lg:gap-10 lg:px-10">
        {indicators.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08} className="flex items-start gap-3.5">
            <item.icon size={20} className="mt-0.5 shrink-0 text-forest-700" />
            <div>
              <div className="font-body text-sm font-semibold text-forest-900">
                {item.label}
              </div>
              <div className="mt-0.5 text-xs leading-relaxed text-ink-500">
                {item.description}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
