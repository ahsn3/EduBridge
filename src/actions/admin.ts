"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { AccountStatus } from "@prisma/client";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN" || user.status !== "ACTIVE") return null;
  return user;
}

export async function getAdminDashboard() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const [
    totalStudents,
    totalInstructors,
    pendingInstructors,
    totalCourses,
    payments,
    recentEnrollments,
    popularCourses,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT", status: "ACTIVE" } }),
    db.user.count({ where: { role: "INSTRUCTOR", status: "ACTIVE" } }),
    db.user.count({ where: { role: "INSTRUCTOR", status: "PENDING" } }),
    db.course.count(),
    db.payment.findMany({
      where: { paymentStatus: "COMPLETED" },
      select: { amount: true },
    }),
    db.enrollment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { titleAr: true, titleEn: true, title: true } },
      },
    }),
    db.course.findMany({
      take: 5,
      include: {
        _count: { select: { enrollments: true } },
        instructor: { select: { name: true } },
      },
      orderBy: { enrollments: { _count: "desc" } },
    }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalStudents,
    totalInstructors,
    pendingInstructors,
    totalCourses,
    totalRevenue,
    recentEnrollments,
    popularCourses,
  };
}

export async function getUsers(role?: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.user.findMany({
    where: role ? { role } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      avatar: true,
      createdAt: true,
      _count: { select: { enrollments: true, courses: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserStatus(userId: string, status: AccountStatus) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target || target.role === "ADMIN") {
    return { error: "Cannot modify this account" };
  }

  await db.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/admin/students");
  revalidatePath("/admin/instructors");
  return { success: true };
}

export async function approveInstructor(userId: string) {
  return updateUserStatus(userId, "ACTIVE");
}

export async function rejectInstructor(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: userId },
    data: { status: "INACTIVE", role: "STUDENT" },
  });
  revalidatePath("/admin/instructors");
  return { success: true };
}

export async function updateUserRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/students");
  revalidatePath("/admin/instructors");
  return { success: true };
}

export async function getAllEnrollments() {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.enrollment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { titleAr: true, titleEn: true, title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateEnrollmentStatus(
  id: string,
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  await db.enrollment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function getAllPayments() {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.payment.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updatePaymentStatus(
  id: string,
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const payment = await db.payment.update({
    where: { id },
    data: { paymentStatus: status },
  });

  if (status === "COMPLETED") {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId: payment.userId,
        status: "PENDING",
      },
    });
    if (enrollment) {
      await db.enrollment.update({
        where: { id: enrollment.id },
        data: { status: "ACTIVE" },
      });
    }
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function getAnalytics() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [enrollments, payments, courses] = await Promise.all([
    db.enrollment.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    db.payment.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, paymentStatus: "COMPLETED" },
      select: { createdAt: true, amount: true },
    }),
    db.course.findMany({
      include: { _count: { select: { enrollments: true } } },
    }),
  ]);

  const monthlyEnrollments: Record<string, number> = {};
  const monthlyRevenue: Record<string, number> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyEnrollments[key] = 0;
    monthlyRevenue[key] = 0;
  }

  enrollments.forEach((e) => {
    const key = `${e.createdAt.getFullYear()}-${String(e.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyEnrollments[key] !== undefined) monthlyEnrollments[key]++;
  });

  payments.forEach((p) => {
    const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyRevenue[key] !== undefined) monthlyRevenue[key] += p.amount;
  });

  return {
    monthlyEnrollments: Object.entries(monthlyEnrollments).map(([month, count]) => ({
      month,
      count,
    })),
    monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    })),
    coursesByEnrollments: courses
      .map((c) => ({ name: c.titleAr, enrollments: c._count.enrollments }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 10),
  };
}

export async function getActiveInstructors() {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.user.findMany({
    where: { role: "INSTRUCTOR", status: "ACTIVE" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllCategories() {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const slug = formData.get("slug") as string;
  const icon = (formData.get("icon") as string) || undefined;
  const description = (formData.get("description") as string) || undefined;

  if (!nameAr || !nameEn || !slug) {
    return { error: "Missing required fields" };
  }

  await db.category.create({
    data: { name: nameAr, nameAr, nameEn, slug, icon, description },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const slug = formData.get("slug") as string;
  const icon = (formData.get("icon") as string) || undefined;
  const description = (formData.get("description") as string) || undefined;

  await db.category.update({
    where: { id },
    data: { name: nameAr, nameAr, nameEn, slug, icon, description },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const count = await db.course.count({ where: { categoryId: id } });
  if (count > 0) {
    return { error: "Cannot delete category with courses" };
  }

  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function getAllTestimonials() {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTestimonial(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const roleAr = formData.get("roleAr") as string;
  const roleEn = formData.get("roleEn") as string;
  const contentAr = formData.get("contentAr") as string;
  const contentEn = formData.get("contentEn") as string;
  const avatar = (formData.get("avatar") as string) || undefined;
  const rating = Number(formData.get("rating") || 5);

  await db.testimonial.create({
    data: {
      name: nameAr,
      nameAr,
      nameEn,
      role: roleAr,
      roleAr,
      roleEn,
      content: contentAr,
      contentAr,
      contentEn,
      avatar,
      rating,
      isActive: true,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const roleAr = formData.get("roleAr") as string;
  const roleEn = formData.get("roleEn") as string;
  const contentAr = formData.get("contentAr") as string;
  const contentEn = formData.get("contentEn") as string;
  const avatar = (formData.get("avatar") as string) || undefined;
  const rating = Number(formData.get("rating") || 5);
  const isActive = formData.get("isActive") === "true";

  await db.testimonial.update({
    where: { id },
    data: {
      name: nameAr,
      nameAr,
      nameEn,
      role: roleAr,
      roleAr,
      roleEn,
      content: contentAr,
      contentAr,
      contentEn,
      avatar,
      rating,
      isActive,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTestimonial(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const item = await db.testimonial.findUnique({ where: { id } });
  if (!item) return { error: "Not found" };

  await db.testimonial.update({
    where: { id },
    data: { isActive: !item.isActive },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}
