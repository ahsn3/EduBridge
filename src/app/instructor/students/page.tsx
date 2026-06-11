import { getInstructorCourses } from "@/actions/instructor";
import { getCourseStudents } from "@/actions/instructor";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default async function InstructorStudentsPage() {
  const courses = await getInstructorCourses();
  const studentsData = await Promise.all(
    courses.map(async (c) => ({
      course: c,
      students: await getCourseStudents(c.id),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الطلاب المسجلون</h1>
        <p className="text-muted-foreground">عرض طلاب دوراتك</p>
      </div>

      {studentsData.map(({ course, students }) => (
        <Card key={course.id}>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">{course.titleAr}</h3>
            {students.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <Avatar>
                      <AvatarImage src={enrollment.user.avatar || undefined} />
                      <AvatarFallback>
                        {getInitials(enrollment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{enrollment.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">لا يوجد طلاب مسجلون</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
