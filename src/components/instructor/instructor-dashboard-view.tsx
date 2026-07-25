"use client";

import Link from "next/link";
import { BookOpen, Users, Video } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedPage } from "@/components/shared/animated-section";
import { formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";
import { useLocale } from "@/hooks/use-locale";
import type { getInstructorDashboard } from "@/actions/instructor";

type DashboardData = NonNullable<Awaited<ReturnType<typeof getInstructorDashboard>>>;

export function InstructorDashboardView({ data }: { data: DashboardData }) {
  const { t, locale } = useLocale();

  return (
    <AnimatedPage>
      <div>
        <h1 className="text-2xl font-bold">{t.instructorDash.title}</h1>
        <p className="text-muted-foreground">{t.instructorDash.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 stagger-children">
        <StatCard title={t.instructorDash.myCourses} value={data.courses.length} icon={BookOpen} />
        <StatCard title={t.nav.students} value={data.totalStudents} icon={Users} />
        <StatCard title={t.instructorDash.upcomingSessions} value={data.upcomingSessions.length} icon={Video} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{t.instructorDash.myCourses}</CardTitle>
            <Button size="sm" asChild>
              <Link href="/instructor/courses">{t.common.manage}</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.courses.slice(0, 5).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{getLocalizedField(course, "title", locale)}</p>
                  <p className="text-xs text-muted-foreground">
                    {course._count.enrollments} {t.instructorDash.studentCount}
                  </p>
                </div>
                <Badge variant={course.isPublished ? "success" : "secondary"}>
                  {course.isPublished ? t.admin.published : t.admin.draft}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base">{t.instructorDash.upcomingSessions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.upcomingSessions.map((session) => (
              <div key={session.id} className="p-3 rounded-xl bg-muted/50 space-y-1">
                <p className="font-medium text-sm">
                  {getLocalizedField(session, "title", locale) || session.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getLocalizedField(session.course, "title", locale)}
                </p>
                <p className="text-xs text-primary">{formatDateTime(session.sessionDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
