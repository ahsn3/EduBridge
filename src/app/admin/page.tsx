import Link from "next/link";
import { Users, GraduationCap, DollarSign, BookOpen } from "lucide-react";
import { getAdminDashboard } from "@/actions/admin";
import { StatCard } from "@/components/shared/stat-card";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDateTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <p className="text-muted-foreground">إدارة المنصة بالكامل — دورات، مدربين، طلاب، والصفحة الرئيسية</p>
      </div>

      <AdminQuickActions />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={data.totalStudents} icon={Users} />
        <StatCard title="Active Instructors" value={data.totalInstructors} icon={GraduationCap} />
        <StatCard title="Pending Instructors" value={data.pendingInstructors} icon={GraduationCap} />
        <StatCard title="Total Courses" value={data.totalCourses} icon={BookOpen} />
        <StatCard
          title="Total Revenue"
          value={formatPrice(data.totalRevenue)}
          icon={DollarSign}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">الدورات الأكثر شعبية</CardTitle>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/admin/courses">إدارة الدورات</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.popularCourses.map((course, i) => (
              <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{course.titleAr}</p>
                    <p className="text-xs text-muted-foreground">{course.instructor.name}</p>
                  </div>
                </div>
                <span className="text-sm font-medium">{course._count.enrollments} طالب</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">آخر التسجيلات</CardTitle>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/admin/enrollments">عرض الكل</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{enrollment.user.name}</p>
                  <p className="text-xs text-muted-foreground">{enrollment.course.titleAr}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(enrollment.createdAt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
