"use client";

import Link from "next/link";
import { Code, Heart, Wrench, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Heart,
  Wrench,
  Briefcase,
};

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string | null;
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const { locale } = useLocale();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            {locale === "ar" ? "تصنيفات الدورات" : "Course Categories"}
          </h2>
          <p className="text-muted-foreground">
            {locale === "ar"
              ? "اختر المجال الذي يناسب اهتماماتك الأكاديمية"
              : "Choose the field that matches your academic interests"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon || ""] || Code;
            return (
              <Link key={cat.id} href={`/courses?category=${cat.slug}`}>
                <Card className="hover-lift text-center h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">
                      {locale === "ar" ? cat.nameAr : cat.nameEn}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
