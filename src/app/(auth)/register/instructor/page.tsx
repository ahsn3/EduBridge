"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { registerInstructor } from "@/actions/auth";
import { savePendingAuth } from "@/lib/pending-auth";
import { toast } from "sonner";

export default function InstructorRegisterPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const email = (formData.get("email") as string).toLowerCase().trim();

    const result = await registerInstructor(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    savePendingAuth({ email, role: "INSTRUCTOR", password });
    toast.success(t.auth.otpSent);
    router.push(`/verify-email?email=${encodeURIComponent(email)}&role=INSTRUCTOR`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle className="text-2xl">{t.auth.instructorRegisterTitle}</CardTitle>
          <CardDescription>{t.auth.instructorRegisterDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-800 dark:text-amber-200">
            {t.auth.instructorApprovalNote}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.name}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
              {loading ? t.common.loading : t.auth.createInstructorAccount}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t.auth.hasAccount}{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              {t.nav.login}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
