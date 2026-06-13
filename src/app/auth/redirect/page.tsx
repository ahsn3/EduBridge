"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getDashboardPath } from "@/lib/auth-utils";
import { isAdminEmail } from "@/lib/admin-emails";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = isAdminEmail(session.user.email) ? "ADMIN" : session.user.role;
    const path = getDashboardPath(role, session.user.status ?? "ACTIVE");
    router.replace(path);
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
