"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocale } from "@/hooks/use-locale";
import { getInitials } from "@/lib/utils";

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
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold">{t.nav.instructors}</h2>
          <p className="text-muted-foreground text-lg">{t.common.tagline}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="hover-lift text-center">
              <CardContent className="p-6 space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/10">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {getInitials(instructor.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{instructor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {locale === "ar" ? instructor.bioAr || instructor.bio : instructor.bioEn || instructor.bio}
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
