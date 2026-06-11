import Link from "next/link";
import { BookOpen, Video, Bell, TrendingUp } from "lucide-react";
import { getStudentDashboard } from "@/actions/student";
import { StatCard } from "@/components/shared/stat-card";
import { CourseCard } from "@/components/courses/course-card";
import { CircularProgress } from "@/components/shared/circular-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";

export default async function StudentDashboardPage() {
  const [user, data] = await Promise.all([getCurrentUser(), getStudentDashboard()]);

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          مرحباً، {user?.name} 👋
        </h1>
        <p className="text-muted-foreground">نظرة عامة على تقدمك الأكاديمي</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="الدورات المسجلة"
          value={data.activeCourses}
          icon={BookOpen}
        />
        <StatCard
          title="الجلسات القادمة"
          value={data.upcomingSessions.length}
          icon={Video}
        />
        <StatCard
          title="نسبة الحضور"
          value={`${data.attendanceRate}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="الإشعارات"
          value={data.unreadNotifications}
          icon={Bell}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">دوراتي</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/courses">عرض الكل</Link>
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
              title="لم تسجل في أي دورة بعد"
              action={{ label: "استكشف الدورات", href: "/courses" }}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">نسبة الحضور</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <CircularProgress value={data.attendanceRate} size={120} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">الجلسات القادمة</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/student/sessions">الكل</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.upcomingSessions.length > 0 ? (
                data.upcomingSessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {getLocalizedField(session.course, "title", "ar")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(session.sessionDate)}
                      </p>
                    </div>
                    {session.googleMeetLink && (
                      <Button size="sm" asChild>
                        <a href={session.googleMeetLink} target="_blank" rel="noopener noreferrer">
                          انضمام
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد جلسات قادمة
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">آخر الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.notifications.length > 0 ? (
                data.notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-2">
                    {!n.readStatus && (
                      <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    )}
                    <div className={n.readStatus ? "ps-5" : ""}>
                      <p className="text-sm font-medium">{n.titleAr || n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {n.messageAr || n.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد إشعارات
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
