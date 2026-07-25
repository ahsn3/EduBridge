"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { validateLoginCredentials } from "@/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string).toLowerCase().trim();
    const password = formData.get("password") as string;

    setLoading(true);

    try {
      const validated = await validateLoginCredentials(formData);

      if (validated.error || !validated.success) {
        toast.error(validated.error || "Invalid email or password");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      window.location.assign(validated.redirectTo || "/auth/redirect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <CardHeader className="text-center space-y-2 pb-4">
        <Logo variant="full" className="justify-center mb-2" />
        <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
        <CardDescription>{t.auth.loginDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                {t.auth.forgotPassword}
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
            {loading ? t.common.loading : t.nav.login}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            {t.nav.register}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
