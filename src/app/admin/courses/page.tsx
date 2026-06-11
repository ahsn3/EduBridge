import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: {
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة الدورات</h1>
        <p className="text-muted-foreground">{courses.length} دورة</p>
      </div>

      <div className="grid gap-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{course.titleAr}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={course.isPublished ? "success" : "secondary"}>
                  {course.isPublished ? "منشور" : "مسودة"}
                </Badge>
                <span className="text-sm font-medium">{formatPrice(course.price)}</span>
                <Badge variant="outline">{course._count.enrollments} طالب</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
