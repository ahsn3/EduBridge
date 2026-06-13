"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export default function AccountSuspendedPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader className="space-y-4">
          <Logo variant="full" className="justify-center" href={null} />
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{t.auth.accountSuspendedTitle}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {t.auth.accountSuspendedDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">{t.auth.backToHome}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
