import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { STUDENT_NAV } from "@/lib/constants";
import { getStudentDashboard } from "@/actions/student";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-emails";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user && (isAdminEmail(user.email) || user.role === "ADMIN")) {
    redirect("/admin");
  }

  const data = await getStudentDashboard();
  const notificationCount = data?.unreadNotifications || 0;

  return (
    <DashboardShell
      navItems={STUDENT_NAV}
      settingsPath="/student/settings"
      notificationCount={notificationCount}
      showMobileNav
    >
      {children}
    </DashboardShell>
  );
}
