"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderOpen,
  MessageSquare,
  UserCheck,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";

const LINKS = [
  { href: "/admin/instructors", icon: GraduationCap, labelAr: "طلبات المدربين", labelEn: "Instructor Requests", descAr: "موافقة / رفض", descEn: "Approve / Reject" },
  { href: "/admin/students", icon: Users, labelAr: "إدارة الطلاب", labelEn: "Manage Students", descAr: "تفعيل / إيقاف", descEn: "Activate / Deactivate" },
  { href: "/admin/courses", icon: BookOpen, labelAr: "إدارة الدورات", labelEn: "Manage Courses", descAr: "إضافة / نشر", descEn: "Add / Publish" },
  { href: "/admin/categories", icon: FolderOpen, labelAr: "التصنيفات", labelEn: "Categories", descAr: "أقسام الهندسة", descEn: "Engineering departments" },
  { href: "/admin/testimonials", icon: MessageSquare, labelAr: "آراء الطلاب", labelEn: "Testimonials", descAr: "الصفحة الرئيسية", descEn: "Landing page" },
  { href: "/admin/enrollments", icon: UserCheck, labelAr: "التسجيلات", labelEn: "Enrollments", descAr: "تفعيل التسجيل", descEn: "Activate enrollments" },
  { href: "/admin/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments", descAr: "تأكيد الدفع", descEn: "Confirm payments" },
  { href: "/admin/analytics", icon: BarChart3, labelAr: "التحليلات", labelEn: "Analytics", descAr: "إحصائيات", descEn: "Statistics" },
] as const;

export function AdminQuickActions() {
  const { locale } = useLocale();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href}>
            <Card className="h-full hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">
                    {locale === "ar" ? link.labelAr : link.labelEn}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {locale === "ar" ? link.descAr : link.descEn}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
