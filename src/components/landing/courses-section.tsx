"use client";

import Link from "next/link";
import { CourseCard } from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

interface CoursesSectionProps {
  courses: Array<{
    id: string;
    title: string;
    titleAr: string;
    titleEn: string;
    thumbnail?: string | null;
    price: number;
    level: string;
    duration: number;
    instructor: { name: string; avatar?: string | null };
    _count?: { enrollments: number };
  }>;
}

export function CoursesSection({ courses }: CoursesSectionProps) {
  const { t } = useLocale();

  return (
    <section id="courses" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">{t.courses.title}</h2>
            <p className="text-muted-foreground">{t.common.tagline}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/courses">{t.common.viewAll}</Link>
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t.common.noResults}
          </div>
        )}
      </div>
    </section>
  );
}
