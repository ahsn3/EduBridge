"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { INSTRUCTOR_NAV } from "@/lib/constants";

const ONBOARDING_PATHS = ["/instructor/complete-profile"];

interface InstructorShellProps {
  children: React.ReactNode;
}

export function InstructorShell({ children }: InstructorShellProps) {
  const pathname = usePathname();
  const isOnboarding = ONBOARDING_PATHS.some((path) => pathname.startsWith(path));

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <DashboardShell navItems={INSTRUCTOR_NAV} settingsPath="/instructor/settings">
      {children}
    </DashboardShell>
  );
}
