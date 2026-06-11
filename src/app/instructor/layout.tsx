import { DashboardShell } from "@/components/layout/dashboard-shell";
import { INSTRUCTOR_NAV } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell navItems={INSTRUCTOR_NAV} settingsPath="/instructor/settings">
      {children}
    </DashboardShell>
  );
}
