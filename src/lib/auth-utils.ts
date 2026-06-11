import type { AccountStatus, Role } from "@prisma/client";

export type AuthIntent = "login" | "student" | "instructor";

export const AUTH_INTENT_COOKIE = "auth_intent";

export function getDashboardPath(role: Role, status: AccountStatus): string {
  if (status === "INACTIVE") return "/account-suspended";
  if (role === "ADMIN") return "/admin";
  if (role === "INSTRUCTOR") {
    return status === "PENDING" ? "/pending-approval" : "/instructor";
  }
  return "/student";
}

export function setAuthIntentCookie(intent: AuthIntent) {
  document.cookie = `${AUTH_INTENT_COOKIE}=${intent}; path=/; max-age=300; SameSite=Lax`;
}
