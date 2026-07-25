"use client";

import Link from "next/link";
import { Users, GraduationCap, DollarSign, BookOpen, FolderOpen, FileText } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/shared/animated-section";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";
import { useLocale } from "@/hooks/use-locale";
import type { getAdminDashboard } from "@/actions/admin";

type DashboardData = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;

export function AdminDashboardView({ data }: { data: DashboardData }) {
  const { t, locale } = useLocale();

  return (
    <AnimatedPage>
      <div>
        <h1 className="text-2xl font-bold">{t.admin.title}</h1>
        <p className="text-muted-foreground">{t.admin.subtitle}</p>
      </div>

      <AdminQuickActions />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title={t.admin.totalStudents} value={data.totalStudents} icon={Users} />
        <StatCard title={t.admin.totalInstructors} value={data.totalInstructors} icon={GraduationCap} />
        <StatCard title={t.admin.pendingInstructors} value={data.pendingInstructors} icon={GraduationCap} />
        <StatCard title={t.admin.totalCourses} value={data.totalCourses} icon={BookOpen} />
        <StatCard title={t.admin.subjects} value={data.totalSubjects} icon={FolderOpen} />
        <StatCard title={t.admin.uploadedFiles} value={data.totalFiles} icon={FileText} />
        <StatCard title={t.admin.activeUsers} value={data.activeUsers} icon={Users} />
        <StatCard title={t.admin.totalRevenue} value={formatPrice(data.totalRevenue)} icon={DollarSign} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{t.admin.popularCourses}</CardTitle>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/admin/courses">{t.admin.manageCourses}</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.popularCourses.map((course, i) => (
              <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{getLocalizedField(course, "title", locale)}</p>
                    <p className="text-xs text-muted-foreground">{course.instructor.name}</p>
                  </div>
                </div>
                <span className="text-sm font-medium">
                  {course._count.enrollments} {t.admin.studentCount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{t.admin.recentEnrollments}</CardTitle>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/admin/enrollments">{t.common.viewAll}</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{enrollment.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getLocalizedField(enrollment.course, "title", locale)}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(enrollment.createdAt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
