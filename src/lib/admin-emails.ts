export const ADMIN_EMAILS = new Set([
  "ahmed@edubridge.com",
  "draz@edubridge.com",
]);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase().trim());
}
