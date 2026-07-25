"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { resetPassword } from "@/actions/password";
import { toast } from "sonner";

function ResetForm() {
  const { t, locale } = useLocale();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set("token", token);
    fd.set("email", email);
    const result = await resetPassword(fd);
    if (result.error) toast.error(result.error);
    else {
      toast.success(locale === "ar" ? "تم تغيير كلمة المرور" : "Password updated");
      window.location.href = "/login";
    }
    setLoading(false);
  }

  if (!token || !email) {
    return (
      <p className="text-center text-sm text-destructive">
        {locale === "ar" ? "رابط غير صالح" : "Invalid reset link"}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">{t.auth.password}</Label>
        <Input id="password" name="password" type="password" required minLength={6} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
        {loading ? t.common.loading : locale === "ar" ? "حفظ كلمة المرور" : "Save Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { locale } = useLocale();
  return (
    <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle>{locale === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password"}</CardTitle>
          <CardDescription>
            {locale === "ar" ? "أدخل كلمة المرور الجديدة" : "Enter your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ResetForm />
          </Suspense>
          <p className="text-center text-sm mt-4">
            <Link href="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
  );
}
