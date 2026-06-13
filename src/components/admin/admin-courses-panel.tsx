"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCourse, updateCourse, deleteCourse, toggleCoursePublish } from "@/actions/courses";
import { useLocale } from "@/hooks/use-locale";
import { formatPrice } from "@/lib/utils";
import { COURSE_LEVELS } from "@/lib/constants";

type Course = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  level: string;
  duration: number;
  thumbnail: string | null;
  isPublished: boolean;
  categoryId: string | null;
  instructor: { name: string };
  _count: { enrollments: number };
};

type Instructor = { id: string; name: string; email: string };
type Category = { id: string; nameAr: string; nameEn: string };

interface AdminCoursesPanelProps {
  courses: Course[];
  instructors: Instructor[];
  categories: Category[];
}

function CourseForm({
  course,
  instructors,
  categories,
  onDone,
}: {
  course?: Course;
  instructors: Instructor[];
  categories: Category[];
  onDone: () => void;
}) {
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(course?.level || "beginner");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || "");
  const [categoryId, setCategoryId] = useState(course?.categoryId || "");
  const [isPublished, setIsPublished] = useState(course?.isPublished ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("level", level);
    formData.set("isPublished", String(isPublished));
    if (!course) formData.set("instructorId", instructorId);
    if (categoryId) formData.set("categoryId", categoryId);

    const result = course
      ? await updateCourse(course.id, formData)
      : await createCourse(formData);

    if (result.error) toast.error(result.error);
    else {
      toast.success(t.common.success);
      onDone();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!course && instructors.length > 0 && (
        <div className="space-y-2">
          <Label>{t.admin.selectInstructor}</Label>
          <Select value={instructorId} onValueChange={setInstructorId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{locale === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
          <Input name="titleAr" defaultValue={course?.titleAr} required />
        </div>
        <div className="space-y-2">
          <Label>{locale === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
          <Input name="titleEn" defaultValue={course?.titleEn} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
        <Textarea name="descriptionAr" defaultValue={course?.descriptionAr} required rows={3} />
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
        <Textarea name="descriptionEn" defaultValue={course?.descriptionEn} required rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.courses.price}</Label>
          <Input name="price" type="number" min="0" defaultValue={course?.price ?? 0} />
        </div>
        <div className="space-y-2">
          <Label>{t.courses.duration}</Label>
          <Input name="duration" type="number" min="0" defaultValue={course?.duration ?? 10} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.courses.level}</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURSE_LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {locale === "ar" ? l.labelAr : l.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {categories.length > 0 && (
          <div className="space-y-2">
            <Label>{locale === "ar" ? "التصنيف" : "Category"}</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {locale === "ar" ? c.nameAr : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "رابط الصورة" : "Thumbnail URL"}</Label>
        <Input name="thumbnail" defaultValue={course?.thumbnail || ""} placeholder="https://..." />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="isPublished">{t.admin.published}</Label>
      </div>
      <Button type="submit" disabled={loading} className="w-full gradient-primary border-0">
        {loading ? t.common.loading : course ? t.common.save : t.admin.createCourse}
      </Button>
    </form>
  );
}

export function AdminCoursesPanel({ courses, instructors, categories }: AdminCoursesPanelProps) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  function refresh() {
    router.refresh();
    setCreateOpen(false);
    setEditCourse(null);
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      const result = await toggleCoursePublish(id);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.common.success);
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm(locale === "ar" ? "حذف هذه الدورة؟" : "Delete this course?")) return;
    startTransition(async () => {
      const result = await deleteCourse(id);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.common.success);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.admin.manageCourses}</h1>
          <p className="text-muted-foreground">
            {courses.length} {t.common.courses}
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="h-4 w-4" />
              {t.admin.createCourse}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.admin.createCourse}</DialogTitle>
            </DialogHeader>
            <CourseForm
              instructors={instructors}
              categories={categories}
              onDone={refresh}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{locale === "ar" ? course.titleAr : course.titleEn}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={course.isPublished ? "default" : "secondary"}>
                  {course.isPublished ? t.admin.published : t.admin.draft}
                </Badge>
                <span className="text-sm font-medium">{formatPrice(course.price)}</span>
                <Badge variant="outline">
                  {course._count.enrollments} {t.common.students}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => handleToggle(course.id)}
                >
                  {course.isPublished ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditCourse(course)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => handleDelete(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editCourse} onOpenChange={(open) => !open && setEditCourse(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.admin.editCourse}</DialogTitle>
          </DialogHeader>
          {editCourse && (
            <CourseForm
              course={editCourse}
              instructors={instructors}
              categories={categories}
              onDone={refresh}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
