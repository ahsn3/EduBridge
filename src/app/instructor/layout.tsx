import { redirect } from "next/navigation";
import { InstructorShell } from "@/components/layout/instructor-shell";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-routing";
import { isAdminEmail } from "@/lib/admin-emails";

export const dynamic = "force-dynamic";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (isAdminEmail(user.email) || user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.role !== "INSTRUCTOR") {
    redirect(getDashboardPath(user.role, user.status));
  }

  if (user.status === "INACTIVE") {
    redirect("/account-suspended");
  }

  return <InstructorShell>{children}</InstructorShell>;
}
