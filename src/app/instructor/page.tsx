import Link from "next/link";
import { BookOpen, Users, Video } from "lucide-react";
import { getInstructorDashboard } from "@/actions/instructor";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";

export default async function InstructorDashboardPage() {
  const data = await getInstructorDashboard();
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">لوحة المدرب</h1>
        <p className="text-muted-foreground">إدارة دوراتك وطلابك</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="دوراتي" value={data.courses.length} icon={BookOpen} />
        <StatCard title="الطلاب" value={data.totalStudents} icon={Users} />
        <StatCard title="جلسات قادمة" value={data.upcomingSessions.length} icon={Video} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">دوراتي</CardTitle>
            <Button size="sm" asChild>
              <Link href="/instructor/courses">إدارة</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.courses.slice(0, 5).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{course.titleAr}</p>
                  <p className="text-xs text-muted-foreground">
                    {course._count.enrollments} طالب
                  </p>
                </div>
                <Badge variant={course.isPublished ? "success" : "secondary"}>
                  {course.isPublished ? "منشور" : "مسودة"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">الجلسات القادمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.upcomingSessions.map((session) => (
              <div key={session.id} className="p-3 rounded-xl bg-muted/50 space-y-1">
                <p className="font-medium text-sm">{session.titleAr || session.title}</p>
                <p className="text-xs text-muted-foreground">
                  {getLocalizedField(session.course, "title", "ar")}
                </p>
                <p className="text-xs text-primary">{formatDateTime(session.sessionDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
