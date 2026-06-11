"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function getInstructorDashboard() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return null;
  }

  const [courses, upcomingSessions, totalStudents] = await Promise.all([
    db.course.findMany({
      where: { instructorId: user.id },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.liveSession.findMany({
      where: {
        course: { instructorId: user.id },
        sessionDate: { gte: new Date() },
      },
      include: { course: { select: { titleAr: true, titleEn: true, title: true } } },
      orderBy: { sessionDate: "asc" },
      take: 5,
    }),
    db.enrollment.count({
      where: { course: { instructorId: user.id }, status: "ACTIVE" },
    }),
  ]);

  return { courses, upcomingSessions, totalStudents };
}

export async function getInstructorCourses() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.course.findMany({
    where: { instructorId: user.id },
    include: {
      category: true,
      _count: {
        select: {
          enrollments: true,
          materials: true,
          liveSessions: true,
          quizzes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseStudents(courseId: string) {
  const user = await getCurrentUser();
  if (!user) return [];

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || (course.instructorId !== user.id && user.role !== "ADMIN")) {
    return [];
  }

  return db.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
}

export async function getInstructorSessions() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.liveSession.findMany({
    where: { course: { instructorId: user.id } },
    include: {
      course: { select: { titleAr: true, titleEn: true, title: true } },
      _count: { select: { attendances: true } },
    },
    orderBy: { sessionDate: "desc" },
  });
}
