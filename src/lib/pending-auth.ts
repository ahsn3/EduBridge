export const PENDING_AUTH_KEY = "edubridge_pending_auth";

export function savePendingAuth(data: {
  email: string;
  role: "STUDENT" | "INSTRUCTOR";
  password: string;
}) {
  sessionStorage.setItem(PENDING_AUTH_KEY, JSON.stringify(data));
}

export function clearPendingAuth() {
  sessionStorage.removeItem(PENDING_AUTH_KEY);
}
