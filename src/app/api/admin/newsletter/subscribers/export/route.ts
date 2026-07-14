import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasGrantedPermission, PERMISSIONS } from "@/lib/permissions";
import { getEffectivePermissions } from "@/lib/permissionGrants";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const permissions = await getEffectivePermissions(session.user.id, session.user.role);
  if (!hasGrantedPermission(permissions, PERMISSIONS.MANAGE_SUBSCRIBERS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  const rows = subscribers.map((s) => `${s.email},${s.name ?? ""},${s.status},${s.createdAt.toISOString()}`);
  const csv = ["email,name,status,subscribedAt", ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="subscribers.csv"`,
    },
  });
}
