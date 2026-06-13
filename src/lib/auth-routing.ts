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
