import { DashboardShell } from "@/components/layout/dashboard-shell";
import { STUDENT_NAV } from "@/lib/constants";
import { getStudentDashboard } from "@/actions/student";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
