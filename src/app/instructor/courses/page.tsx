import Link from "next/link";
import { Pencil, Users } from "lucide-react";
import { getInstructorCourses } from "@/actions/instructor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateCourseDialog } from "@/components/instructor/create-course-dialog";

export default async function InstructorCoursesPage() {
  const courses = await getInstructorCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة الدورات</h1>
          <p className="text-muted-foreground">إنشاء وتعديل دوراتك</p>
        </div>
        <CreateCourseDialog />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover-lift">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold line-clamp-2">{course.titleAr}</h3>
                <Badge variant={course.isPublished ? "success" : "secondary"}>
                  {course.isPublished ? "منشور" : "مسودة"}
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {course._count.enrollments}
                </span>
                <span>{course._count.materials} مواد</span>
                <span>{course._count.liveSessions} جلسات</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                    تعديل
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/instructor/courses/${course.id}/students`}>
                    <Users className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">لم تنشئ أي دورة بعد</p>
              <CreateCourseDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
