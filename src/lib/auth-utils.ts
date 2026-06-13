
export type AuthIntent = "login" | "student" | "instructor";

export const AUTH_INTENT_COOKIE = "auth_intent";

export { getDashboardPath } from "./auth-routing";

export function setAuthIntentCookie(intent: AuthIntent) {
  document.cookie = `${AUTH_INTENT_COOKIE}=${intent}; path=/; max-age=300; SameSite=Lax`;
}
