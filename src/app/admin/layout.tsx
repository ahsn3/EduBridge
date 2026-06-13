import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ADMIN_NAV } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-routing";
import { isAdminEmail } from "@/lib/admin-emails";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const role = isAdminEmail(session.user.email) ? "ADMIN" : session.user.role;
  const status = session.user.status ?? "ACTIVE";

  if (status !== "ACTIVE" || role !== "ADMIN") {
    redirect(getDashboardPath(role, status));
  }

  return (
    <DashboardShell navItems={ADMIN_NAV} settingsPath="/admin">
      {children}
    </DashboardShell>
  );
}
