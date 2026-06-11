"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { useLocale } from "@/hooks/use-locale";
import { getLocalizedField } from "@/lib/i18n/translations";

interface CoursesBrowserProps {
  initialCourses: Array<{
    id: string;
    title: string;
    titleAr: string;
    titleEn: string;
    thumbnail?: string | null;
    price: number;
    level: string;
    duration: number;
    categoryId?: string | null;
    instructor: { name: string; avatar?: string | null };
    _count?: { enrollments: number };
  }>;
  categories: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
  }>;
}

export function CoursesBrowser({ initialCourses, categories }: CoursesBrowserProps) {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialCourses.filter((course) => {
      const title = getLocalizedField(course, "title", locale).toLowerCase();
      const matchesSearch = !search || title.includes(search.toLowerCase());
      const matchesCategory = !categoryId || course.categoryId === categoryId;
      const matchesLevel = !level || course.level === level;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [initialCourses, search, categoryId, level, locale]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t.courses.title}</h1>
        <p className="text-muted-foreground mt-2">{t.common.tagline}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.courses.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!categoryId ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryId(null)}
          >
            {t.courses.allCategories}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryId === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryId(cat.id)}
            >
              {locale === "ar" ? cat.nameAr : cat.nameEn}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {["beginner", "intermediate", "advanced"].map((l) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            size="sm"
            onClick={() => setLevel(level === l ? null : l)}
          >
            {l}
          </Button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">{t.common.noResults}</p>
      )}
    </div>
  );
}
