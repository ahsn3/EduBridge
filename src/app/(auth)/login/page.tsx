"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Shield, GraduationCap, UserCog } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { validateLoginCredentials } from "@/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const { t, locale } = useLocale();
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

  const roles = [
    {
      icon: Shield,
      title: locale === "ar" ? "المديرون" : "Managers",
      desc: locale === "ar"
        ? "أحمد ودراز — إدارة المنصة والموافقات"
        : "Ahmed & Draz — platform management & approvals",
      color: "text-violet-600 bg-violet-500/10",
    },
    {
      icon: UserCog,
      title: locale === "ar" ? "المدربون" : "Instructors",
      desc: locale === "ar"
        ? "إنشاء الدورات وإدارة الطلاب"
        : "Create courses & manage students",
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      icon: GraduationCap,
      title: locale === "ar" ? "الطلاب" : "Students",
      desc: locale === "ar"
        ? "التسجيل في الدورات ومتابعة التقدم"
        : "Enroll in courses & track progress",
      color: "text-emerald-600 bg-emerald-500/10",
    },
  ];

  return (
    <div className="w-full max-w-4xl grid lg:grid-cols-[1fr,340px] gap-6 items-start">
      <Card className="shadow-xl border-0 lg:border">
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

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground px-1">
          {locale === "ar" ? "أنواع الحسابات" : "Account types"}
        </p>
        {roles.map((role) => (
          <div
            key={role.title}
            className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 flex gap-3 items-start"
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${role.color}`}>
              <role.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{role.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground px-1 pt-1">
          {locale === "ar"
            ? "المدربون والطلاب يسجلون من صفحة التسجيل. المديرون يستخدمون بيانات الدخول المخصصة."
            : "Instructors and students sign up via Register. Managers use dedicated admin credentials."}
        </p>
      </div>
    </div>
  );
}
