"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { LoginForm } from "@/components/auth/login-form";

export function LoginPageClient({ error }: { error?: string }) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 start-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
          <CardDescription>{t.auth.loginDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <p className="text-sm text-destructive text-center rounded-lg bg-destructive/10 p-3">
              {decodeURIComponent(error)}
            </p>
          ) : null}
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              {t.nav.register}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
