import { notFound } from "next/navigation";
import { getCourseById } from "@/actions/courses";
import { getCurrentUser } from "@/lib/auth";
import { CourseManageTabs } from "@/components/instructor/course-manage-tabs";

export default async function InstructorCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, user] = await Promise.all([getCourseById(id), getCurrentUser()]);

  if (!course || (course.instructorId !== user?.id && user?.role !== "ADMIN")) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{course.titleAr}</h1>
        <p className="text-muted-foreground">إدارة محتوى الدورة</p>
      </div>
      <CourseManageTabs course={course} />
    </div>
  );
}
