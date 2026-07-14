import { NextResponse } from "next/server";
import { unsubscribeByEmail } from "@/lib/actions/newsletter";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (email) {
    await unsubscribeByEmail(email);
  }

  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head>
    <body style="font-family: sans-serif; max-width: 480px; margin: 80px auto; text-align: center; color: #1B4332;">
      <h1 style="font-size: 20px;">You've been unsubscribed</h1>
      <p style="color: #4b5563;">You won't receive any more newsletter emails from MariePrime Global.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
