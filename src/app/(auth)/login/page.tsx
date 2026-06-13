import { LoginPageClient } from "@/components/auth/login-page-client";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-routing";
import { isAdminEmail } from "@/lib/admin-emails";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user?.email) {
    const role = isAdminEmail(session.user.email) ? "ADMIN" : session.user.role;
    redirect(getDashboardPath(role, session.user.status ?? "ACTIVE"));
  }

  return <LoginPageClient error={params.error} />;
}
