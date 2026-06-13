import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ADMIN_NAV } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-routing";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" || user.status !== "ACTIVE") {
    redirect(getDashboardPath(user.role, user.status));
  }

  return (
    <DashboardShell navItems={ADMIN_NAV} settingsPath="/admin">
      {children}
    </DashboardShell>
  );
}
