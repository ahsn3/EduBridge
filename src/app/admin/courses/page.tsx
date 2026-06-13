import { db } from "@/lib/db";
import { getActiveInstructors, getAllCategories } from "@/actions/admin";
import { AdminCoursesPanel } from "@/components/admin/admin-courses-panel";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [courses, instructors, categories] = await Promise.all([
    db.course.findMany({
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getActiveInstructors(),
    getAllCategories(),
  ]);

  return (
    <AdminCoursesPanel
      courses={courses}
      instructors={instructors}
      categories={categories}
    />
  );
}
