"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { verifyEmailOtp, resendEmailOtp } from "@/actions/auth";
import { toast } from "sonner";
import { Mail } from "lucide-react";

const PENDING_AUTH_KEY = "edubridge_pending_auth";

function VerifyEmailForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [code, setCode] = useState("");

  const email = searchParams.get("email") || "";
  const role = (searchParams.get("role") as "STUDENT" | "INSTRUCTOR") || "STUDENT";

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const pendingRaw = sessionStorage.getItem(PENDING_AUTH_KEY);
    const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

    const formData = new FormData();
    formData.set("email", email);
    formData.set("code", code);
    formData.set("role", role);
    if (pending?.password) {
      formData.set("password", pending.password);
    }

    const result = await verifyEmailOtp(formData);

    if (result.error && !result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    sessionStorage.removeItem(PENDING_AUTH_KEY);

    if (result.needsLogin) {
      toast.success(t.auth.verifySuccessLogin);
      router.push("/login");
      return;
    }

    toast.success(t.auth.verifySuccess);
    router.push(result.redirectTo || (role === "INSTRUCTOR" ? "/pending-approval" : "/student"));
    router.refresh();
  }

  async function handleResend() {
    setResending(true);
    const result = await resendEmailOtp(email, role);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t.auth.otpResent);
    }
    setResending(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Logo variant="full" className="justify-center mb-2" />
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t.auth.verifyEmailTitle}</CardTitle>
          <CardDescription>{t.auth.verifyEmailDesc}</CardDescription>
          <p className="text-sm font-medium text-primary">{email}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t.auth.otpCode}</Label>
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
                className="text-center text-2xl tracking-[0.5em] font-mono"
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary border-0"
              disabled={loading || code.length !== 6}
            >
              {loading ? t.common.loading : t.auth.verifyEmail}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t.auth.otpExpiryNote}</p>
            <Button variant="link" onClick={handleResend} disabled={resending}>
              {resending ? t.common.loading : t.auth.resendOtp}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/register" className="text-primary font-medium hover:underline">
              {t.auth.backToRegister}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
