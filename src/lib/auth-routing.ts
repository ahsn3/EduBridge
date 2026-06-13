import { db } from "@/lib/db";
import type { AccountStatus, InstructorApprovalStatus, Role } from "@prisma/client";

export function getDashboardPath(
  role: Role,
  status: AccountStatus,
  instructorProfileCompleted?: boolean
): string {
  if (status === "INACTIVE") return "/account-suspended";
  if (role === "ADMIN") return "/admin";
  if (role === "INSTRUCTOR") {
    if (status === "PENDING") {
      if (instructorProfileCompleted === false) return "/instructor/complete-profile";
      return "/pending-approval";
    }
    return "/instructor";
  }
  return "/student";
}

export async function getPostLoginPath(userId: string): Promise<string> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      instructorProfile: {
        select: { profileCompleted: true, approvalStatus: true },
      },
    },
  });

  if (!user) return "/login";

  const profileCompleted = user.instructorProfile?.profileCompleted ?? undefined;

  if (
    user.role === "INSTRUCTOR" &&
    user.status === "PENDING" &&
    user.instructorProfile?.approvalStatus === "INFO_REQUESTED"
  ) {
    return "/instructor/complete-profile";
  }

  return getDashboardPath(user.role, user.status, profileCompleted);
}

export function instructorNeedsProfile(
  role: Role,
  status: AccountStatus,
  approvalStatus?: InstructorApprovalStatus | null,
  profileCompleted?: boolean
): boolean {
  if (role !== "INSTRUCTOR") return false;
  if (approvalStatus === "INFO_REQUESTED") return true;
  if (status === "PENDING" && !profileCompleted) return true;
  return false;
}
