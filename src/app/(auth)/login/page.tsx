"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/hooks/use-locale";
import { loginUser } from "@/actions/auth";
import { getDashboardPath } from "@/lib/auth-utils";
import { toast } from "sonner";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const path = getDashboardPath(session?.user?.role, session?.user?.status);
    router.push(path);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
              {loading ? t.common.loading : t.nav.login}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              {t.auth.orContinueWith}
            </span>
          </div>

          <GoogleAuthButton intent="login" label={t.auth.google} />

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
