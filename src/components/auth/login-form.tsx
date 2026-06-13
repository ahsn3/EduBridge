"use client";

import { useFormStatus } from "react-dom";
import { useLocale } from "@/hooks/use-locale";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLocale();

  return (
    <Button type="submit" className="w-full gradient-primary border-0" disabled={pending}>
      {pending ? t.common.loading : t.nav.login}
    </Button>
  );
}

export function LoginForm() {
  const { t } = useLocale();

  return (
    <form action={loginAction} className="space-y-4">
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
      <SubmitButton />
    </form>
  );
}
