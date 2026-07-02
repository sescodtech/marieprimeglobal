import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seedData";

export async function GET(request: Request) {
  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return NextResponse.json(
      { error: "SETUP_SECRET is not set. Add it in Vercel env vars to enable this endpoint." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const providedSecret = searchParams.get("secret");

  if (providedSecret !== setupSecret) {
    return NextResponse.json({ error: "Invalid or missing secret." }, { status: 401 });
  }

  try {
    const log = await seedDatabase();
    return NextResponse.json({
      status: "ok",
      message: "Database seeded. Remove SETUP_SECRET from your env vars now to lock this endpoint.",
      log,
    });
  } catch (error) {
    console.error("[setup] seeding failed:", error);
    return NextResponse.json({ error: "Seeding failed. Check Vercel logs." }, { status: 500 });
  }
}
