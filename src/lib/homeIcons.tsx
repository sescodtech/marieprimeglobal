import {
  Stamp,
  PlaneTakeoff,
  BedDouble,
  ShieldCheck,
  CalendarCheck2,
  Sparkles,
  PackageSearch,
  Truck,
  Users,
  Headset,
  Globe2,
  Award,
  Clock,
  Handshake,
  MessageCircle,
  FileSearch,
  Workflow,
  BadgeCheck,
  Briefcase,
  PlaneLanding,
  type LucideIcon,
} from "lucide-react";

/** Icon keys used by Service records (and the default home-services fallback). */
export const serviceIconMap: Record<string, LucideIcon> = {
  visa: Stamp,
  flight: PlaneTakeoff,
  hotel: BedDouble,
  insurance: ShieldCheck,
  event: CalendarCheck2,
  beauty: Sparkles,
  procurement: PackageSearch,
  logistics: Truck,
  pof: FileSearch,
};

/** Fallback icon for admin-added services that don't set an icon key. */
export const defaultServiceIcon: LucideIcon = Briefcase;

export function getServiceIcon(key?: string | null): LucideIcon {
  if (!key) return defaultServiceIcon;
  return serviceIconMap[key] ?? defaultServiceIcon;
}

/** Icon keys used by the Statistics section. */
export const statIconMap: Record<string, LucideIcon> = {
  users: Users,
  shield: ShieldCheck,
  headset: Headset,
  globe: Globe2,
};

/** Icon keys used by the "Why Choose Marie Prime Global" brand pillars. */
export const pillarIconMap: Record<string, LucideIcon> = {
  globe: Globe2,
  award: Award,
  users: Users,
  clock: Clock,
  shield: ShieldCheck,
  handshake: Handshake,
};

/** Icon keys used by the Client Journey timeline. */
export const journeyIconMap: Record<string, LucideIcon> = {
  consultation: MessageCircle,
  document: FileSearch,
  processing: Workflow,
  approval: BadgeCheck,
  preparation: Briefcase,
  journey: PlaneLanding,
};
