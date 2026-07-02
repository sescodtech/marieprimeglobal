import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  light = false,
  className,
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em]",
        light ? "text-gold-300" : "text-gold-600",
        className
      )}
    >
      <span className="h-px w-6 bg-current" />
      {children}
    </span>
  );
}
