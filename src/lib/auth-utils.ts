import type { AccountStatus, InstructorApprovalStatus, Role } from "@prisma/client";
import { isAdminEmail } from "@/lib/admin-emails";
import { getDashboardPath } from "./auth-routing";

export type AuthIntent = "login" | "student" | "instructor";

export const AUTH_INTENT_COOKIE = "auth_intent";

export { getDashboardPath };

export interface DashboardSessionUser {
  email?: string | null;
  role: Role;
  status: AccountStatus;
  instructorProfileCompleted?: boolean;
  instructorApprovalStatus?: InstructorApprovalStatus | null;
}

export function resolveSessionRole(user: DashboardSessionUser): Role {
  if (isAdminEmail(user.email)) return "ADMIN";
  return user.role;
}

export function getDashboardPathFromSession(user: DashboardSessionUser): string {
  const role = resolveSessionRole(user);
  const status = role === "ADMIN" ? "ACTIVE" : user.status;
  return getDashboardPath(role, status, user.instructorProfileCompleted);
}

export function setAuthIntentCookie(intent: AuthIntent) {
  document.cookie = `${AUTH_INTENT_COOKIE}=${intent}; path=/; max-age=300; SameSite=Lax`;
}
