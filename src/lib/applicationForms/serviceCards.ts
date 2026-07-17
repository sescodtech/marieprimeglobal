import { prisma } from "@/lib/prisma";
import { SERVICE_APPLICATION_CONFIGS, SERVICE_APPLICATION_TYPES, getApplicationPathSlug } from "./config";
import { getServiceControlState } from "./serviceFormControl";
import { getGlobalFormControls } from "@/lib/content";
import type { ServiceApplicationType } from "./types";

const ICON_KEY_BY_TYPE: Record<ServiceApplicationType, string> = {
  VISA: "visa",
  FLIGHT_BOOKING: "flight",
  HOTEL_RESERVATION: "hotel",
  TRAVEL_INSURANCE: "insurance",
  EVENT_COORDINATION: "event",
  BEAUTY_SERVICES: "beauty",
  PROCUREMENT: "procurement",
  LOGISTICS: "logistics",
  PROOF_OF_FUNDS: "pof",
};

export type ApplyServiceCard = {
  type: ServiceApplicationType;
  slug: string;
  title: string;
  summary: string;
  icon: string;
};

/**
 * One card per applicable service, for the /apply picker. Titles/summaries
 * come from the live CMS Service record when one matches (so editing a
 * service's marketing copy in /admin/services updates this too), falling
 * back to the built-in config copy for Proof of Funds, which has no CMS page.
 */
export async function getApplyServiceCards(): Promise<ApplyServiceCard[]> {
  const cmsSlugs = SERVICE_APPLICATION_TYPES.map((type) => SERVICE_APPLICATION_CONFIGS[type].cmsSlug).filter(
    (slug): slug is string => Boolean(slug)
  );

  const cmsServices = await prisma.service.findMany({
    where: { slug: { in: cmsSlugs }, isPublished: true, isArchived: false },
  });
  const cmsBySlug = new Map(cmsServices.map((s) => [s.slug, s]));
  const globalControls = await getGlobalFormControls();

  return SERVICE_APPLICATION_TYPES.filter((type) => {
    const config = SERVICE_APPLICATION_CONFIGS[type];
    // Proof of Funds has no CMS record, so it's always available online
    // (subject only to the global applications switch).
    if (!config.cmsSlug) return globalControls.applicationsEnabled;
    const cms = cmsBySlug.get(config.cmsSlug);
    // If the service hasn't been published/found yet, still show it using
    // the built-in fallback copy rather than silently dropping it.
    if (!cms) return globalControls.applicationsEnabled;
    return getServiceControlState(cms, config.cmsSlug, globalControls).showApply;
  }).map((type) => {
    const config = SERVICE_APPLICATION_CONFIGS[type];
    const cms = config.cmsSlug ? cmsBySlug.get(config.cmsSlug) : undefined;
    return {
      type,
      slug: getApplicationPathSlug(type),
      title: cms?.title ?? config.title,
      summary: cms?.summary ?? config.summary,
      icon: cms?.icon ?? ICON_KEY_BY_TYPE[type],
    };
  });
}
