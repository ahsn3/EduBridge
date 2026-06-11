import { getStudentDashboard } from "@/actions/student";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";

export default async function StudentCoursesPage() {
  const data = await getStudentDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">دوراتي</h1>
        <p className="text-muted-foreground">جميع الدورات المسجلة</p>
      </div>

      {data && data.enrollments.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.enrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              course={enrollment.course}
              progress={enrollment.progress}
              showProgress
              enrolled
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
  );
}
