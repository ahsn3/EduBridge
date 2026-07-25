"use client";

import Link from "next/link";
import { BookOpen, Video, Bell, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { CourseCard } from "@/components/courses/course-card";
import { CircularProgress } from "@/components/shared/circular-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatedPage } from "@/components/shared/animated-section";
import { formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";
import { useLocale } from "@/hooks/use-locale";
import type { getStudentDashboard } from "@/actions/student";

type DashboardData = NonNullable<Awaited<ReturnType<typeof getStudentDashboard>>>;

interface StudentDashboardViewProps {
  userName?: string | null;
  data: DashboardData;
}

export function StudentDashboardView({ userName, data }: StudentDashboardViewProps) {
  const { t, locale } = useLocale();

  return (
    <AnimatedPage>
      <div>
        <h1 className="text-2xl font-bold">
          {t.dashboard.welcome}{locale === "ar" ? "،" : ","} {userName} 👋
        </h1>
        <p className="text-muted-foreground">{t.dashboard.progressOverview}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title={t.dashboard.enrolledCourses} value={data.activeCourses} icon={BookOpen} />
        <StatCard title={t.dashboard.upcomingSessions} value={data.upcomingSessions.length} icon={Video} />
        <StatCard title={t.dashboard.attendanceRate} value={`${data.attendanceRate}%`} icon={TrendingUp} />
        <StatCard title={t.common.notifications} value={data.unreadNotifications} icon={Bell} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.dashboard.myCourses}</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/courses">{t.common.viewAll}</Link>
            </Button>
          </div>

          {data.enrollments.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {data.enrollments.slice(0, 4).map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  progress={enrollment.progress}
                  showProgress
                  enrolled
                  nextSession={
                    enrollment.course.liveSessions[0]
                      ? formatDateTime(enrollment.course.liveSessions[0].sessionDate)
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title={t.dashboard.noCourses}
              action={{ label: t.common.exploreCourses, href: "/courses" }}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t.dashboard.attendanceRate}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <CircularProgress value={data.attendanceRate} size={120} />
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.dashboard.upcomingSessions}</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/student/sessions">{t.common.all}</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.upcomingSessions.length > 0 ? (
                data.upcomingSessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {getLocalizedField(session.course, "title", locale)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(session.sessionDate)}
                      </p>
                    </div>
                    {session.googleMeetLink && (
                      <Button size="sm" asChild>
                        <a href={session.googleMeetLink} target="_blank" rel="noopener noreferrer">
                          {t.common.join}
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t.dashboard.noSessions}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t.dashboard.recentNotifications}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.notifications.length > 0 ? (
                data.notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-2">
                    {!n.readStatus && (
                      <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    )}
                    <div className={n.readStatus ? "ps-5" : ""}>
                      <p className="text-sm font-medium">
                        {getLocalizedField(n, "title", locale) || n.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {getLocalizedField(n, "message", locale) || n.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t.dashboard.noNotifications}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
