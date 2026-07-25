"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, LogOut } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { getCurrentDashboardPath } from "@/actions/session";
import { getDashboardPathFromSession } from "@/lib/auth-utils";
import { AnimatedPage } from "@/components/shared/animated-section";

export default function PendingApprovalPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const checkApprovalStatus = useCallback(async () => {
    if (!session?.user) return;

    const targetPath = await getCurrentDashboardPath();
    const currentPath = getDashboardPathFromSession(session.user);

    if (targetPath !== currentPath && targetPath !== "/pending-approval") {
      await update();
      router.replace(targetPath);
    }
  }, [session, update, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated" && session?.user) {
      const path = getDashboardPathFromSession(session.user);
      if (path !== "/pending-approval") {
        router.replace(path);
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(checkApprovalStatus, 15000);
    return () => clearInterval(interval);
  }, [status, checkApprovalStatus]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <AnimatedPage className="w-full max-w-md space-y-0">
        <Card className="shadow-xl text-center border-0">
          <CardHeader className="space-y-4">
            <Logo variant="full" className="justify-center" href={null} />
            <div className="mx-auto h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center animate-scale-in">
              <Clock className="h-7 w-7 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">{t.auth.pendingApprovalTitle}</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {t.auth.pendingApprovalDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <LogOut className="h-4 w-4" />
                {t.auth.backToHome}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedPage>
    </div>
  );
}
