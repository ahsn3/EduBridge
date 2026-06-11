"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocale } from "@/hooks/use-locale";
import { getLocalizedField } from "@/lib/i18n/translations";
import { formatPrice, getInitials } from "@/lib/utils";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    titleAr: string;
    titleEn: string;
    thumbnail?: string | null;
    price: number;
    level: string;
    duration: number;
    instructor: {
      name: string;
      avatar?: string | null;
    };
    _count?: { enrollments: number };
  };
  progress?: number;
  nextSession?: string;
  showProgress?: boolean;
  enrolled?: boolean;
}

export function CourseCard({
  course,
  progress,
  nextSession,
  showProgress = false,
  enrolled = false,
}: CourseCardProps) {
  const { locale, t } = useLocale();
  const title = getLocalizedField(course, "title", locale);

  return (
    <Card className="group overflow-hidden hover-lift">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 start-3">
          <Badge variant="secondary" className="backdrop-blur-sm bg-white/80">
            {course.level}
          </Badge>
        </div>
        {course.price === 0 ? (
          <div className="absolute top-3 end-3">
            <Badge variant="success">{t.common.free}</Badge>
          </div>
        ) : (
          <div className="absolute top-3 end-3">
            <Badge className="gradient-primary border-0">
              {formatPrice(course.price, locale === "ar" ? "ar-TR" : "en-US")}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.instructor.avatar || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(course.instructor.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {course.instructor.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course._count?.enrollments || 0}
          </span>
        </div>

        {showProgress && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t.common.progress}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {nextSession && (
          <p className="text-xs text-muted-foreground">
            {t.dashboard.nextSession}: {nextSession}
          </p>
        )}

        <Button
          asChild
          className="w-full"
          variant={enrolled ? "default" : "outline"}
        >
          <Link href={`/courses/${course.id}`}>
            <BookOpen className="h-4 w-4" />
            {enrolled ? t.common.continue : t.courses.viewCourse}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
