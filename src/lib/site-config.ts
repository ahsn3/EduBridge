export const SITE_NAME = "EduBridge";

export const SITE_DESCRIPTION =
  "Professional educational platform for Arab students in Turkish universities.";

export const SITE_DESCRIPTION_AR =
  "منصة تعليمية احترافية للطلاب العرب في الجامعات التركية";

export const BRAND = {
  logo: "/branding/logo.jpg",
  logoName: "/branding/logo-name.jpg",
  logoFull: "/branding/logo-full.jpg",
  ogImage: "/og-image.jpg",
} as const;

const PRODUCTION_FALLBACK_URL = "https://web-production-c82f6.up.railway.app";

export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : undefined);

  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_FALLBACK_URL;
  }

  return "http://localhost:3000";
}

export function getAbsoluteUrl(path: string, baseUrl?: string): string {
  const base = (baseUrl ?? getSiteUrl()).replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
