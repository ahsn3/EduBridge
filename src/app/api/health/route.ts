import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: Date.now(),
    authSecretConfigured: Boolean(process.env.AUTH_SECRET),
    authUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? null,
  });
}
