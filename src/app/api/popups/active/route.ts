import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Returns every enabled, currently-in-date-range popup whose display rule
 * matches the given path — the client picks which one(s) to actually show
 * based on trigger rule and session/local storage state (handled entirely
 * client-side so a page reload doesn't nag the visitor again pointlessly).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "/";
  const now = new Date();

  const popups = await prisma.popup.findMany({
    where: {
      isEnabled: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { order: "asc" },
  });

  const eligible = popups.filter((popup) => {
    switch (popup.displayRule) {
      case "ENTIRE_WEBSITE":
        return true;
      case "HOMEPAGE_ONLY":
        return path === "/";
      case "SPECIFIC_PAGE":
        return popup.displayTarget ? path === popup.displayTarget : false;
      case "SPECIFIC_SERVICE":
        return popup.displayTarget ? path === `/services/${popup.displayTarget}` : false;
      case "SPECIFIC_BLOG":
        return popup.displayTarget ? path === `/blog/${popup.displayTarget}` : false;
      default:
        return false;
    }
  });

  return NextResponse.json({
    popups: eligible.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      buttonText: p.buttonText,
      buttonLink: p.buttonLink,
      imageUrl: p.imageUrl,
      bgColor: p.bgColor,
      textColor: p.textColor,
      triggerRule: p.triggerRule,
      triggerValue: p.triggerValue,
    })),
  });
}
