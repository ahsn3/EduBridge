"use client";

import Image from "next/image";
import { Award, BookOpen, CheckCircle2, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/hooks/use-locale";
import { getLocalizedField } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface JourneyProps {
  enrollments: Array<{
    id: string;
    status: string;
    progress: number;
    createdAt: Date;
    course: {
      id: string;
      title: string;
      titleAr: string;
      titleEn: string;
      thumbnail?: string | null;
      level: string;
    };
  }>;
  certificates: Array<{
    id: string;
    issuedAt: Date;
    course: { titleAr: string; titleEn: string; title: string };
  }>;
  achievements: Array<{ type: string; count: number; label: string }>;
}

export function AcademicJourney({ enrollments, certificates, achievements }: JourneyProps) {
  const { t, locale } = useLocale();

  const currentSemester = locale === "ar" ? "الربيع 2026" : "Spring 2026";
  const active = enrollments.filter((e) => e.status === "ACTIVE");
  const completed = enrollments.filter((e) => e.status === "COMPLETED");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.dashboard.academicJourney}</h1>
          <p className="text-muted-foreground">{t.dashboard.currentSemester}: {currentSemester}</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary" className="px-4 py-2">
            {active.length} {t.dashboard.activeCourses}
          </Badge>
          <Badge variant="success" className="px-4 py-2">
            {completed.length} {t.dashboard.completedCourses}
          </Badge>
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a) => (
            <Card key={a.type} className="text-center hover-lift">
              <CardContent className="p-4 space-y-2">
                <Trophy className="h-8 w-8 text-amber-500 mx-auto" />
                <p className="text-2xl font-bold">{a.count}</p>
                <p className="text-xs text-muted-foreground">{a.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {locale === "ar" ? "مسار التعلم" : "Learning Path"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {enrollments.map((enrollment, index) => {
                const title = getLocalizedField(enrollment.course, "title", locale);
                const isCompleted = enrollment.status === "COMPLETED";

                return (
                  <div key={enrollment.id} className="relative flex gap-6 ps-2">
                    <div
                      className={cn(
                        "relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2",
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-background border-primary text-primary"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                        {enrollment.course.thumbnail && (
                          <div className="relative h-16 w-24 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={enrollment.course.thumbnail}
                              alt={title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{title}</h3>
                            <Badge variant={isCompleted ? "success" : "secondary"}>
                              {enrollment.course.level}
                            </Badge>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {enrollment.progress}% {t.common.progress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              {t.common.certificates}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
                >
                  <Award className="h-10 w-10 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-medium">
                      {locale === "ar" ? cert.course.titleAr : cert.course.titleEn}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.issuedAt).toLocaleDateString(
                        locale === "ar" ? "ar-EG" : "en-US"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
