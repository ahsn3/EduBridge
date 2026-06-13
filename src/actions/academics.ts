"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { RecordStatus } from "@prisma/client";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN" || user.status !== "ACTIVE") return null;
  return user;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function getAcademicTree() {
  const admin = await requireAdmin();
  if (!admin) return [];

  return db.university.findMany({
    where: { status: { not: "DELETED" } },
    include: {
      faculties: {
        where: { status: { not: "DELETED" } },
        include: {
          departments: {
            where: { status: { not: "DELETED" } },
            include: {
              academicYears: {
                where: { status: { not: "DELETED" } },
                include: {
                  subjects: { where: { status: { not: "DELETED" } } },
                },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
    orderBy: { nameAr: "asc" },
  });
}

export async function createUniversity(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  if (!nameAr || !nameEn) return { error: "Missing fields" };

  await db.university.create({
    data: { nameAr, nameEn, slug: slugify(nameEn) },
  });
  revalidatePath("/admin/academics");
  return { success: true };
}

export async function createFaculty(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const universityId = formData.get("universityId") as string;
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;

  await db.faculty.create({
    data: { universityId, nameAr, nameEn, slug: slugify(nameEn) },
  });
  revalidatePath("/admin/academics");
  return { success: true };
}

export async function createDepartment(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const facultyId = formData.get("facultyId") as string;
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;

  await db.department.create({
    data: { facultyId, nameAr, nameEn, slug: slugify(nameEn) },
  });
  revalidatePath("/admin/academics");
  return { success: true };
}

export async function createAcademicYear(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const departmentId = formData.get("departmentId") as string;
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const yearNumber = Number(formData.get("yearNumber") || 1);

  await db.academicYear.create({
    data: { departmentId, nameAr, nameEn, yearNumber, order: yearNumber },
  });
  revalidatePath("/admin/academics");
  return { success: true };
}

export async function createSubject(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const academicYearId = formData.get("academicYearId") as string;
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;

  await db.subject.create({
    data: { academicYearId, nameAr, nameEn, slug: slugify(nameEn) },
  });
  revalidatePath("/admin/academics");
  return { success: true };
}

export async function archiveRecord(
  type: "university" | "faculty" | "department" | "year" | "subject",
  id: string
) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const status: RecordStatus = "ARCHIVED";
  const map = {
    university: () => db.university.update({ where: { id }, data: { status } }),
    faculty: () => db.faculty.update({ where: { id }, data: { status } }),
    department: () => db.department.update({ where: { id }, data: { status } }),
    year: () => db.academicYear.update({ where: { id }, data: { status } }),
    subject: () => db.subject.update({ where: { id }, data: { status } }),
  };
  await map[type]();
  revalidatePath("/admin/academics");
  return { success: true };
}

export async function getSubjectsList() {
  return db.subject.findMany({
    where: { status: "ACTIVE" },
    include: {
      academicYear: {
        include: {
          department: {
            include: { faculty: { include: { university: true } } },
          },
        },
      },
    },
    orderBy: { nameAr: "asc" },
  });
}
