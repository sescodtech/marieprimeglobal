import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { event?: "view" | "click" | "close" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const field = body.event === "click" ? "clicks" : body.event === "close" ? "closes" : "views";

  try {
    await prisma.popup.update({ where: { id }, data: { [field]: { increment: 1 } } });
  } catch {
    // Popup may have been deleted since the client fetched it — non-fatal.
  }

  return NextResponse.json({ ok: true });
}
