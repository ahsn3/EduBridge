"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, UserCog, Shield } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { useSession } from "next-auth/react";
import { getDashboardPathFromSession } from "@/lib/auth-utils";

export default function RegisterHubPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace(getDashboardPathFromSession(session.user));
    }
  }, [status, session, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle className="text-2xl">{t.auth.registerHubTitle}</CardTitle>
          <CardDescription>{t.auth.registerHubDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/register/student" className="block group">
              <div className="rounded-2xl border-2 border-transparent p-6 h-full group-hover:border-emerald-500/50 group-hover:shadow-md transition-all text-center space-y-3 bg-emerald-500/5">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold">{t.auth.studentCardTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.auth.studentCardDesc}</p>
              </div>
            </Link>
            <Link href="/register/instructor" className="block group">
              <div className="rounded-2xl border-2 border-transparent p-6 h-full group-hover:border-amber-500/50 group-hover:shadow-md transition-all text-center space-y-3 bg-amber-500/5">
                <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/15 flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold">{t.auth.instructorCardTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.auth.instructorCardDesc}</p>
              </div>
            </Link>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 flex gap-3 items-start">
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {locale === "ar" ? "حسابات المديرين" : "Manager accounts"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locale === "ar"
                  ? "أحمد ودراز لديهم حسابات مدير. لا يمكن التسجيل كمدير — استخدم تسجيل الدخول."
                  : "Ahmed and Draz have manager accounts. Managers cannot self-register — use Sign In."}
              </p>
            </div>
          </div>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">
              {t.auth.hasAccount} {t.nav.login}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
