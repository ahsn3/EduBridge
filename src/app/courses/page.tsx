import { getCourses, getCategories } from "@/actions/courses";
import { CoursesBrowser } from "@/components/courses/courses-browser";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <CoursesBrowser initialCourses={courses} categories={categories} />
      </div>
      <Footer />
    </main>
  );
}
