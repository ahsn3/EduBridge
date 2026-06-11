"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";

interface Instructor {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  bioAr?: string | null;
  bioEn?: string | null;
  _count?: { courses: number };
}

export function InstructorsSection({ instructors }: { instructors: Instructor[] }) {
  const { t, locale } = useLocale();

  return (
    <section id="instructors" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t.nav.instructors}</h2>
          <p className="text-muted-foreground text-lg">{t.common.tagline}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="hover-lift text-center">
              <CardContent className="p-6 space-y-4">
                <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary/10">
                  <Image
                    src={instructor.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{instructor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {locale === "ar"
                      ? instructor.bioAr || instructor.bio
                      : instructor.bioEn || instructor.bio}
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    {instructor._count?.courses || 0} {t.common.courses}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
