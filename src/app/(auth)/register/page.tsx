"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, UserCog } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { useSession } from "next-auth/react";
import { getDashboardPath } from "@/lib/auth-utils";

export default function RegisterHubPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace(getDashboardPath(session.user.role, session.user.status));
    }
  }, [status, session, router]);

  if (status === "loading" || status === "authenticated") {
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
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle className="text-2xl">{t.auth.registerHubTitle}</CardTitle>
          <CardDescription>{t.auth.registerHubDesc}</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Link href="/register/student" className="block">
            <div className="rounded-2xl border p-6 h-full hover:border-primary hover:shadow-md transition-all text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t.auth.studentCardTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.auth.studentCardDesc}</p>
            </div>
          </Link>
          <Link href="/register/instructor" className="block">
            <div className="rounded-2xl border p-6 h-full hover:border-primary hover:shadow-md transition-all text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t.auth.instructorCardTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.auth.instructorCardDesc}</p>
            </div>
          </Link>
          <Button asChild variant="ghost" className="sm:col-span-2">
            <Link href="/login">
              {t.auth.hasAccount} {t.nav.login}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
