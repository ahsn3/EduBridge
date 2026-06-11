export const SITE_NAME = "EduBridge";

export const SITE_DESCRIPTION =
  "Professional educational platform for Arab students in Turkish universities.";

export const SITE_DESCRIPTION_AR =
  "منصة تعليمية احترافية للطلاب العرب في الجامعات التركية";

export const BRAND = {
  logo: "/branding/logo.jpg",
  logoName: "/branding/logo-name.jpg",
  logoFull: "/branding/logo-full.jpg",
} as const;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
