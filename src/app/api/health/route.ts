import { NextResponse } from "next/server";
import { getAuthSecret, isAuthConfigured } from "@/lib/auth-secret";

export const dynamic = "force-dynamic";

export async function GET() {
  const secret = getAuthSecret();
  const authUrl =
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    (process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : null);

  return NextResponse.json({
    status: "ok",
    timestamp: Date.now(),
    authSecretConfigured: isAuthConfigured(),
    authSecretLength: secret?.length ?? 0,
    authUrl,
    trustHost: process.env.AUTH_TRUST_HOST ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}
