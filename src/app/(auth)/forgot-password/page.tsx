"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { requestPasswordReset } from "@/actions/password";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await requestPasswordReset(new FormData(e.currentTarget));
    if (result.error) toast.error(result.error);
    else {
      setSent(true);
      toast.success(locale === "ar" ? "تحقق من بريدك" : "Check your email");
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle>{t.auth.forgotPassword}</CardTitle>
          <CardDescription>
            {locale === "ar"
              ? "سنرسل لك رابط إعادة تعيين كلمة المرور"
              : "We'll send you a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-center text-sm text-muted-foreground">
              {locale === "ar"
                ? "إذا كان البريد مسجلاً، ستصلك رسالة قريباً."
                : "If the email is registered, you'll receive a link shortly."}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
                {loading ? t.common.loading : locale === "ar" ? "إرسال الرابط" : "Send Reset Link"}
              </Button>
            </form>
          )}
          <p className="text-center text-sm mt-4">
            <Link href="/login" className="text-primary hover:underline">{t.nav.login}</Link>
          </p>
        </CardContent>
      </Card>
  );
}
