import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
  showArrow?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external = false,
  showArrow = true,
}: ButtonProps) {
  const base =
    "group inline-flex items-center gap-2 rounded-stub px-6 py-3 font-body text-sm font-semibold tracking-wide transition-all duration-300";

  const variants = {
    primary:
      "bg-forest-700 text-cream-50 hover:bg-forest-800 shadow-stub",
    secondary:
      "bg-gold-500 text-forest-900 hover:bg-gold-400 shadow-stub",
    ghost:
      "border border-forest-700/30 text-forest-700 hover:border-forest-700 hover:bg-forest-700/5",
  };

  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
      {showArrow && (
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </Link>
  );
}
