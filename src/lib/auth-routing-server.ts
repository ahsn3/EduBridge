import { db } from "@/lib/db";
import { getDashboardPath } from "@/lib/auth-routing";

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
