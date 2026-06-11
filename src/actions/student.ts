"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getStudentDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = session.user.id;

  const [enrollments, upcomingSessions, notifications, attendances, certificates] =
    await Promise.all([
      db.enrollment.findMany({
        where: { userId, status: { in: ["ACTIVE", "COMPLETED"] } },
        include: {
          course: {
            include: {
              instructor: { select: { name: true, avatar: true } },
              liveSessions: {
                where: { sessionDate: { gte: new Date() } },
                orderBy: { sessionDate: "asc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      db.liveSession.findMany({
        where: {
          sessionDate: { gte: new Date() },
          course: { enrollments: { some: { userId, status: "ACTIVE" } } },
        },
        include: { course: { select: { titleAr: true, titleEn: true, title: true } } },
        orderBy: { sessionDate: "asc" },
        take: 5,
      }),
      db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.attendance.findMany({
        where: { userId },
      }),
      db.certificate.findMany({
        where: { userId },
        include: { course: { select: { titleAr: true, titleEn: true, title: true } } },
      }),
    ]);

  const totalSessions = await db.liveSession.count({
    where: {
      course: { enrollments: { some: { userId, status: "ACTIVE" } } },
    },
  });

  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const attendanceRate =
    totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  const unreadNotifications = await db.notification.count({
    where: { userId, readStatus: false },
  });

  return {
    enrollments,
    upcomingSessions,
    notifications,
    certificates,
    attendanceRate,
    unreadNotifications,
    activeCourses: enrollments.filter((e) => e.status === "ACTIVE").length,
    completedCourses: enrollments.filter((e) => e.status === "COMPLETED").length,
  };
}

export async function getAcademicJourney() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = session.user.id;

  const [enrollments, certificates, quizAttempts] = await Promise.all([
    db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            titleEn: true,
            thumbnail: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.certificate.findMany({
      where: { userId },
      include: { course: true },
    }),
    db.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 10,
    }),
  ]);

  const achievements = [
  ...(certificates.length > 0
    ? [{ type: "certificate", count: certificates.length, label: "شهادات" }]
    : []),
  ...(quizAttempts.filter((q) => q.score >= 80).length > 0
    ? [{ type: "quiz", count: quizAttempts.filter((q) => q.score >= 80).length, label: "اختبارات ناجحة" }]
    : []),
  ...(enrollments.filter((e) => e.status === "COMPLETED").length > 0
    ? [{ type: "course", count: enrollments.filter((e) => e.status === "COMPLETED").length, label: "دورات مكتملة" }]
    : []),
  ];

  return { enrollments, certificates, achievements, quizAttempts };
}

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  await db.notification.update({
    where: { id, userId: session.user.id },
    data: { readStatus: true },
  });

  revalidatePath("/student/notifications");
  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    const data = profileSchema.parse({
      name: formData.get("name"),
      phone: formData.get("phone") || undefined,
      bio: formData.get("bio") || undefined,
      locale: formData.get("locale"),
    });

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        nameAr: data.name,
        nameEn: data.name,
        phone: data.phone,
        bio: data.bio,
        bioAr: data.bio,
        bioEn: data.bio,
        locale: data.locale,
      },
    });

    revalidatePath("/student/settings");
    return { success: true };
  } catch {
    return { error: "Failed to update profile" };
  }
}

export async function getNotifications() {
  const session = await auth();
  if (!session?.user) return [];

  return db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
