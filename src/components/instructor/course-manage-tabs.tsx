"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createLiveSession,
  createMaterial,
  createAssignment,
  createAnnouncement,
} from "@/actions/courses";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

interface CourseManageTabsProps {
  course: {
    id: string;
    titleAr: string;
    materials: Array<{ id: string; titleAr: string | null; title: string; fileUrl: string }>;
    assignments: Array<{ id: string; titleAr: string | null; title: string; dueDate: Date }>;
    liveSessions: Array<{ id: string; titleAr: string | null; title: string; sessionDate: Date; googleMeetLink: string | null }>;
    announcements: Array<{ id: string; titleAr: string | null; title: string; content: string; createdAt: Date }>;
    quizzes: Array<{ id: string; titleAr: string | null; title: string }>;
  };
}

export function CourseManageTabs({ course }: CourseManageTabsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(
    action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>,
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("courseId", course.id);
    const result = await action(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("تم بنجاح");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Tabs defaultValue="sessions">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="sessions">الجلسات</TabsTrigger>
        <TabsTrigger value="materials">المواد</TabsTrigger>
        <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => handleAction(createLiveSession, e)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان الجلسة (عربي)</Label>
                  <Input name="titleAr" required />
                </div>
                <div className="space-y-2">
                  <Label>عنوان الجلسة (إنجليزي)</Label>
                  <Input name="titleEn" required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ الجلسة</Label>
                  <Input name="sessionDate" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label>رابط Google Meet</Label>
                  <Input name="googleMeetLink" placeholder="https://meet.google.com/..." />
                </div>
              </div>
              <input type="hidden" name="duration" value="60" />
              <Button type="submit" disabled={loading}>إضافة جلسة</Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {course.liveSessions.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border flex justify-between">
              <div>
                <p className="font-medium">{s.titleAr || s.title}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(s.sessionDate)}</p>
              </div>
              {s.googleMeetLink && (
                <a href={s.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-primary text-sm">
                  رابط الجلسة
                </a>
              )}
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="materials" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => handleAction(createMaterial, e)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان (عربي)</Label>
                  <Input name="titleAr" required />
                </div>
                <div className="space-y-2">
                  <Label>العنوان (إنجليزي)</Label>
                  <Input name="titleEn" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>رابط الملف (PDF)</Label>
                <Input name="fileUrl" required placeholder="https://..." />
              </div>
              <input type="hidden" name="fileType" value="pdf" />
              <Button type="submit" disabled={loading}>إضافة مادة</Button>
            </form>
          </CardContent>
        </Card>
        {course.materials.map((m) => (
          <div key={m.id} className="p-4 rounded-xl border flex justify-between">
            <span>{m.titleAr || m.title}</span>
            <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm">تحميل</a>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="assignments" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => handleAction(createAssignment, e)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان (عربي)</Label>
                  <Input name="titleAr" required />
                </div>
                <div className="space-y-2">
                  <Label>العنوان (إنجليزي)</Label>
                  <Input name="titleEn" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea name="description" required rows={3} />
              </div>
              <div className="space-y-2">
                <Label>تاريخ التسليم</Label>
                <Input name="dueDate" type="datetime-local" required />
              </div>
              <Button type="submit" disabled={loading}>إضافة واجب</Button>
            </form>
          </CardContent>
        </Card>
        {course.assignments.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border">
            <p className="font-medium">{a.titleAr || a.title}</p>
            <p className="text-sm text-muted-foreground">التسليم: {formatDateTime(a.dueDate)}</p>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="announcements" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => handleAction(createAnnouncement, e)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان (عربي)</Label>
                  <Input name="titleAr" required />
                </div>
                <div className="space-y-2">
                  <Label>العنوان (إنجليزي)</Label>
                  <Input name="titleEn" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المحتوى (عربي)</Label>
                <Textarea name="contentAr" required rows={3} />
              </div>
              <div className="space-y-2">
                <Label>المحتوى (إنجليزي)</Label>
                <Textarea name="contentEn" required rows={3} />
              </div>
              <Button type="submit" disabled={loading}>إرسال إعلان</Button>
            </form>
          </CardContent>
        </Card>
        {course.announcements.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border">
            <p className="font-medium">{a.titleAr || a.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
