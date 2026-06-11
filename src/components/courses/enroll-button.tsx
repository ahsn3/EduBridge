"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enrollInCourse } from "@/actions/courses";
import { useLocale } from "@/hooks/use-locale";
import { toast } from "sonner";

interface EnrollButtonProps {
  courseId: string;
  price: number;
}

export function EnrollButton({ courseId, price }: EnrollButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  async function handleEnroll() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const result = await enrollInCourse(courseId, coupon || undefined);
    if (result.error) toast.error(result.error);
    else {
      toast.success(t.common.success);
      router.push("/student/courses");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      {price > 0 && (
        <>
          {!showCoupon ? (
            <button
              type="button"
              onClick={() => setShowCoupon(true)}
              className="text-xs text-primary hover:underline w-full text-center"
            >
              {locale === "ar" ? "لديك كود خصم؟" : "Have a coupon?"}
            </button>
          ) : (
            <Input
              placeholder={locale === "ar" ? "كود الخصم" : "Coupon code"}
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
          )}
        </>
      )}
      <Button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full gradient-primary border-0"
      >
        {loading ? t.common.loading : price === 0 ? t.common.enroll : t.courses.enrollNow}
      </Button>
    </div>
  );
}
