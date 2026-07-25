import { createHash } from "crypto";

let warnedAboutDerivedSecret = false;

/** Stable secret derived from DATABASE_URL when AUTH_SECRET is not set on Railway. */
function deriveSecretFromDatabase(): string | undefined {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return undefined;

  return createHash("sha256").update(`edubridge-jwt-v1:${dbUrl}`).digest("base64");
}

/** Edge-safe secret for middleware — never uses Node-only crypto APIs. */
export function getMiddlewareAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "dev-local-auth-secret-edubridge"
  );
}

export function getAuthSecret(): string {
  const explicit = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (explicit) return explicit;

  const derived = deriveSecretFromDatabase();
  if (derived) {
    if (process.env.NODE_ENV === "production" && !warnedAboutDerivedSecret) {
      warnedAboutDerivedSecret = true;
      console.warn(
        "AUTH_SECRET not set — using stable secret derived from DATABASE_URL. " +
          "Add AUTH_SECRET to Railway for best practice (openssl rand -base64 32)."
      );
    }
    return derived;
  }

  return "dev-local-auth-secret-edubridge";
}

export function isAuthSecretExplicit(): boolean {
  return Boolean(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
}

export function isAuthConfigured(): boolean {
  return Boolean(getAuthSecret());
}
