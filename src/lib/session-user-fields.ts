import { db } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin-emails";
import type { AccountStatus, InstructorApprovalStatus, Role } from "@prisma/client";

export interface SessionUserFields {
  id: string;
  role: Role;
  status: AccountStatus;
  locale: string;
  name: string | null;
  email: string;
  picture: string | null;
  instructorProfileCompleted: boolean;
  instructorApprovalStatus: InstructorApprovalStatus | null;
}

export async function getSessionUserFields(userId: string): Promise<SessionUserFields | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      locale: true,
      avatar: true,
      instructorProfile: {
        select: {
          profileCompleted: true,
          approvalStatus: true,
        },
      },
    },
  });

  if (!user) return null;

  const email = user.email.toLowerCase().trim();
  const role = isAdminEmail(email) ? "ADMIN" : user.role;
  const status = role === "ADMIN" ? "ACTIVE" : user.status;

  return {
    id: user.id,
    role,
    status,
    locale: user.locale ?? "ar",
    name: user.name,
    email: user.email,
    picture: user.avatar,
    instructorProfileCompleted: user.instructorProfile?.profileCompleted ?? false,
    instructorApprovalStatus: user.instructorProfile?.approvalStatus ?? null,
  };
}
