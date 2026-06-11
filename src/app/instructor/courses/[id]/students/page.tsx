import { notFound } from "next/navigation";
import { getCourseById } from "@/actions/courses";
import { getCourseStudents } from "@/actions/instructor";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export default async function CourseStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, students, user] = await Promise.all([
    getCourseById(id),
    getCourseStudents(id),
    getCurrentUser(),
  ]);

  if (!course || (course.instructorId !== user?.id && user?.role !== "ADMIN")) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">طلاب {course.titleAr}</h1>
        <p className="text-muted-foreground">{students.length} طالب مسجل</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardContent className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={enrollment.user.avatar || undefined} />
                <AvatarFallback>{getInitials(enrollment.user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{enrollment.user.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {enrollment.user.email}
                </p>
              </div>
              <Badge variant="secondary">{enrollment.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
