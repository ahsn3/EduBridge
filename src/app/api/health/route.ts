import { NextResponse } from "next/server";
import { getAuthSecret, isAuthConfigured, isAuthSecretExplicit } from "@/lib/auth-secret";
import { getEmailJsConfigSummary } from "@/lib/email-config";

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
    authSecretExplicit: isAuthSecretExplicit(),
    authSecretLength: secret.length,
    authUrl,
    trustHost: process.env.AUTH_TRUST_HOST ?? "true",
    nodeEnv: process.env.NODE_ENV ?? null,
    emailJs: getEmailJsConfigSummary(),
  });
}
