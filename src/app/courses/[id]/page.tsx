import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Users,
  BookOpen,
  FileText,
  Video,
  ClipboardList,
  Brain,
} from "lucide-react";
import { getCourseById } from "@/actions/courses";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnrollButton } from "@/components/courses/enroll-button";
import { Button } from "@/components/ui/button";
import { formatPrice, getInitials, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, session] = await Promise.all([
    getCourseById(id),
    auth(),
  ]);

  if (!course) notFound();

  let isEnrolled = false;
  if (session?.user) {
    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: id } },
    });
    isEnrolled = !!enrollment && enrollment.status !== "CANCELLED";
  }

  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <div className="relative h-64 md:h-80 bg-muted">
          {course.thumbnail && (
            <Image
              src={course.thumbnail}
              alt={course.titleAr}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{course.level}</Badge>
                  {course.category && (
                    <Badge variant="secondary">{course.category.nameAr}</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{course.titleAr}</h1>
                <p className="text-muted-foreground leading-relaxed">
                  {course.descriptionAr}
                </p>
              </div>

              <Tabs defaultValue="materials">
                <TabsList>
                  <TabsTrigger value="materials">المواد</TabsTrigger>
                  <TabsTrigger value="sessions">الجلسات</TabsTrigger>
                  <TabsTrigger value="assignments">الواجبات</TabsTrigger>
                  <TabsTrigger value="quizzes">الاختبارات</TabsTrigger>
                </TabsList>

                <TabsContent value="materials" className="space-y-3 mt-4">
                  {isEnrolled ? (
                    course.materials.length > 0 ? (
                      course.materials.map((m) => (
                        <Card key={m.id}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <span>{m.titleAr || m.title}</span>
                            </div>
                            <a
                              href={m.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              تحميل
                            </a>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">لا توجد مواد بعد</p>
                    )
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      سجّل في الدورة للوصول للمواد
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="sessions" className="space-y-3 mt-4">
                  {course.liveSessions.map((s) => (
                    <Card key={s.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{s.titleAr || s.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(s.sessionDate)}
                            </p>
                          </div>
                        </div>
                        {isEnrolled && s.googleMeetLink && (
                          <a
                            href={s.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            انضمام
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="assignments" className="space-y-3 mt-4">
                  {isEnrolled ? (
                    course.assignments.map((a) => (
                      <Card key={a.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{a.titleAr || a.title}</p>
                              <p className="text-sm text-muted-foreground">
                                التسليم: {formatDateTime(a.dueDate)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      سجّل في الدورة للوصول للواجبات
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="quizzes" className="space-y-3 mt-4">
                  {isEnrolled ? (
                    course.quizzes.map((q) => (
                      <Card key={q.id}>
                        <CardContent className="p-4 flex items-center gap-3">
                          <Brain className="h-5 w-5 text-primary" />
                          <span>{q.titleAr || q.title}</span>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      سجّل في الدورة للوصول للاختبارات
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    {course.price === 0 ? (
                      <p className="text-3xl font-bold text-emerald-600">مجاني</p>
                    ) : (
                      <p className="text-3xl font-bold">{formatPrice(course.price)}</p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.duration} ساعة
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {course._count.enrollments} طالب
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      {course.materials.length} مادة
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Button asChild className="w-full" variant="secondary">
                      <Link href="/student/courses">متابعة التعلم</Link>
                    </Button>
                  ) : (
                    <EnrollButton courseId={course.id} price={course.price} />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">المدرب</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructor.avatar || undefined} />
                    <AvatarFallback>
                      {getInitials(course.instructor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.instructor.bioAr || course.instructor.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
