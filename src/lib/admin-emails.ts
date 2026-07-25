export const ADMIN_EMAILS = new Set([
  "ahmed@admin.com",
  "draz@admin.com",
]);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase().trim());
}
