import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "/";
  const now = new Date();

  const announcements = await prisma.announcement.findMany({
    where: {
      isEnabled: true,
      isArchived: false,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { priority: "desc" },
  });

  const eligible = announcements.filter((a) => {
    if (a.displayRule === "ENTIRE_WEBSITE") return true;
    if (a.displayRule === "HOMEPAGE") return path === "/";
    if (a.displayRule === "SELECTED_PAGES") {
      const pages = Array.isArray(a.selectedPages) ? (a.selectedPages as string[]) : [];
      return pages.includes(path);
    }
    return false;
  });

  return NextResponse.json({
    announcements: eligible.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      icon: a.icon,
      buttonText: a.buttonText,
      buttonLink: a.buttonLink,
      bgColor: a.bgColor,
      textColor: a.textColor,
    })),
  });
}
