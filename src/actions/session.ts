"use server";

import { getCurrentUser } from "@/lib/auth";
import { getSessionUserFields } from "@/lib/session-user-fields";
import { getPostLoginPath } from "@/lib/auth-routing-server";

export async function getSessionRefreshPayload() {
  const user = await getCurrentUser();
  if (!user) return null;

  const fields = await getSessionUserFields(user.id);
  if (!fields) return null;

  return {
    status: fields.status,
    role: fields.role,
    name: fields.name,
    locale: fields.locale,
    instructorProfileCompleted: fields.instructorProfileCompleted,
    instructorApprovalStatus: fields.instructorApprovalStatus,
  };
}

export async function getCurrentDashboardPath() {
  const user = await getCurrentUser();
  if (!user) return "/login";
  return getPostLoginPath(user.id);
}
