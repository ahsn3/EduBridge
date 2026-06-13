"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth, getCurrentUser } from "@/lib/auth";
import { courseSchema, sessionSchema, materialSchema, assignmentSchema, quizSchema, announcementSchema } from "@/lib/validations";

export async function getCourses(filters?: {
  categoryId?: string;
  search?: string;
  level?: string;
}) {
  const where: Record<string, unknown> = { isPublished: true };

  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.level) where.level = filters.level;
  if (filters?.search) {
    where.OR = [
      { titleAr: { contains: filters.search, mode: "insensitive" } },
      { titleEn: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return db.course.findMany({
    where,
    include: {
      instructor: { select: { id: true, name: true, avatar: true } },
      category: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseById(id: string) {
  return db.course.findUnique({
    where: { id },
    include: {
      instructor: { select: { id: true, name: true, avatar: true, bio: true, bioAr: true, bioEn: true } },
      category: true,
      materials: { orderBy: { order: "asc" } },
      assignments: { orderBy: { dueDate: "asc" } },
      quizzes: true,
      liveSessions: { orderBy: { sessionDate: "asc" } },
      announcements: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function createCourse(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const data = courseSchema.parse({
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      descriptionAr: formData.get("descriptionAr"),
      descriptionEn: formData.get("descriptionEn"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId") || undefined,
      level: formData.get("level"),
      duration: formData.get("duration"),
      thumbnail: formData.get("thumbnail") || undefined,
      isPublished: formData.get("isPublished") === "true",
    });

    const instructorId =
      user.role === "ADMIN"
        ? (formData.get("instructorId") as string) || user.id
        : user.id;

    const course = await db.course.create({
      data: {
        ...data,
        title: data.titleAr,
        description: data.descriptionAr,
        instructorId,
      },
    });

    revalidatePath("/instructor/courses");
    revalidatePath("/admin/courses");
    revalidatePath("/");
    return { success: true, courseId: course.id };
  } catch (error) {
    console.error("Create course error:", error);
    return { error: "Failed to create course" };
  }
}

export async function updateCourse(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const course = await db.course.findUnique({ where: { id } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const data = courseSchema.parse({
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      descriptionAr: formData.get("descriptionAr"),
      descriptionEn: formData.get("descriptionEn"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId") || undefined,
      level: formData.get("level"),
      duration: formData.get("duration"),
      thumbnail: formData.get("thumbnail") || undefined,
      isPublished: formData.get("isPublished") === "true",
    });

    await db.course.update({
      where: { id },
      data: { ...data, title: data.titleAr, description: data.descriptionAr },
    });

    revalidatePath(`/courses/${id}`);
    revalidatePath("/instructor/courses");
    revalidatePath("/admin/courses");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to update course" };
  }
}

export async function deleteCourse(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const course = await db.course.findUnique({ where: { id } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  await db.course.delete({ where: { id } });
  revalidatePath("/instructor/courses");
  revalidatePath("/admin/courses");
  revalidatePath("/");
  return { success: true };
}

export async function toggleCoursePublish(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "Unauthorized" };

  const course = await db.course.findUnique({ where: { id } });
  if (!course) return { error: "Course not found" };

  await db.course.update({
    where: { id },
    data: { isPublished: !course.isPublished },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/");
  return { success: true };
}

export async function enrollInCourse(courseId: string, couponCode?: string) {
  const session = await auth();
  if (!session?.user) return { error: "Please login first" };

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existing) return { error: "Already enrolled" };

  let discount = 0;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
    if (coupon?.isActive) {
      discount = coupon.discountType === "percentage"
        ? course.price * (coupon.discountValue / 100)
        : coupon.discountValue;
      await db.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  const finalAmount = Math.max(0, course.price - discount);

  await db.$transaction([
    db.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: finalAmount === 0 ? "ACTIVE" : "PENDING",
      },
    }),
    ...(finalAmount > 0
      ? [
          db.payment.create({
            data: {
              userId: session.user.id,
              amount: finalAmount,
              paymentStatus: "PENDING",
              couponCode,
              discount,
              description: `Enrollment in ${course.title}`,
            },
          }),
        ]
      : []),
    db.notification.create({
      data: {
        userId: session.user.id,
        title: "تم التسجيل بنجاح",
        titleAr: "تم التسجيل بنجاح",
        titleEn: "Enrollment Successful",
        message: `تم تسجيلك في دورة ${course.titleAr}`,
        messageAr: `تم تسجيلك في دورة ${course.titleAr}`,
        messageEn: `You enrolled in ${course.titleEn}`,
        type: "success",
        link: `/courses/${courseId}`,
      },
    }),
  ]);

  revalidatePath("/student/courses");
  return { success: true };
}

export async function createLiveSession(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const data = sessionSchema.parse({
      courseId: formData.get("courseId"),
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      googleMeetLink: formData.get("googleMeetLink"),
      sessionDate: formData.get("sessionDate"),
      duration: formData.get("duration"),
      description: formData.get("description"),
    });

    const session = await db.liveSession.create({
      data: {
        ...data,
        title: data.titleAr,
        sessionDate: new Date(data.sessionDate),
      },
    });

    const enrollments = await db.enrollment.findMany({
      where: { courseId: data.courseId, status: "ACTIVE" },
    });

    await db.notification.createMany({
      data: enrollments.map((e) => ({
        userId: e.userId,
        title: "جلسة جديدة",
        titleAr: "جلسة جديدة",
        titleEn: "New Session",
        message: `جلسة جديدة: ${data.titleAr}`,
        messageAr: `جلسة جديدة: ${data.titleAr}`,
        messageEn: `New session: ${data.titleEn}`,
        type: "info",
        link: `/student/sessions`,
      })),
    });

    revalidatePath("/instructor/sessions");
    return { success: true, sessionId: session.id };
  } catch {
    return { error: "Failed to create session" };
  }
}

export async function createMaterial(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = materialSchema.parse({
      courseId: formData.get("courseId"),
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      fileUrl: formData.get("fileUrl"),
      fileType: formData.get("fileType"),
    });

    await db.material.create({
      data: { ...data, title: data.titleAr },
    });

    revalidatePath(`/courses/${data.courseId}`);
    return { success: true };
  } catch {
    return { error: "Failed to add material" };
  }
}

export async function createAssignment(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = assignmentSchema.parse({
      courseId: formData.get("courseId"),
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      maxScore: formData.get("maxScore"),
    });

    await db.assignment.create({
      data: { ...data, title: data.titleAr, dueDate: new Date(data.dueDate) },
    });

    return { success: true };
  } catch {
    return { error: "Failed to create assignment" };
  }
}

export async function createQuiz(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = quizSchema.parse({
      courseId: formData.get("courseId"),
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      duration: formData.get("duration"),
    });

    await db.quiz.create({
      data: { ...data, title: data.titleAr },
    });

    return { success: true };
  } catch {
    return { error: "Failed to create quiz" };
  }
}

export async function createAnnouncement(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = announcementSchema.parse({
      courseId: formData.get("courseId"),
      titleAr: formData.get("titleAr"),
      titleEn: formData.get("titleEn"),
      contentAr: formData.get("contentAr"),
      contentEn: formData.get("contentEn"),
    });

    await db.announcement.create({
      data: {
        ...data,
        title: data.titleAr,
        content: data.contentAr,
        authorId: user.id,
      },
    });

    return { success: true };
  } catch {
    return { error: "Failed to create announcement" };
  }
}

export async function markAttendance(sessionId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  await db.attendance.upsert({
    where: {
      userId_sessionId: { userId: session.user.id, sessionId },
    },
    create: {
      userId: session.user.id,
      sessionId,
      status: "PRESENT",
      joinedAt: new Date(),
    },
    update: {
      status: "PRESENT",
      joinedAt: new Date(),
    },
  });

  return { success: true };
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}
