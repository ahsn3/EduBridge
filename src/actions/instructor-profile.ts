"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { instructorProfileSchema } from "@/lib/validations";
import { notifyAllAdmins } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function getInstructorProfile() {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") return null;

  return db.instructorProfile.findUnique({
    where: { userId: user.id },
  });
}

export async function completeInstructorProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { error: "Unauthorized" };
  }

  try {
    const data = instructorProfileSchema.parse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      universityId: formData.get("universityId") || undefined,
      facultyId: formData.get("facultyId") || undefined,
      departmentId: formData.get("departmentId") || undefined,
      universityName: formData.get("universityName") || undefined,
      facultyName: formData.get("facultyName") || undefined,
      departmentName: formData.get("departmentName") || undefined,
      academicPositionAr: formData.get("academicPositionAr"),
      academicPositionEn: formData.get("academicPositionEn"),
      avatar: formData.get("avatar") || undefined,
      cvUrl: formData.get("cvUrl"),
    });

    const { name, phone, avatar, universityId, facultyId, departmentId, ...rest } = data;

    let universityName = data.universityName;
    let facultyName = data.facultyName;
    let departmentName = data.departmentName;

    if (universityId) {
      const u = await db.university.findUnique({ where: { id: universityId } });
      universityName = u?.nameAr;
    }
    if (facultyId) {
      const f = await db.faculty.findUnique({ where: { id: facultyId } });
      facultyName = f?.nameAr;
    }
    if (departmentId) {
      const d = await db.department.findUnique({ where: { id: departmentId } });
      departmentName = d?.nameAr;
    }

    const profileData = {
      ...rest,
      universityId: universityId || undefined,
      facultyId: facultyId || undefined,
      departmentId: departmentId || undefined,
      universityName,
      facultyName,
      departmentName,
    };

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: {
          name,
          nameAr: name,
          nameEn: name,
          phone,
          avatar: avatar || undefined,
        },
      }),
      db.instructorProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          ...profileData,
          profileCompleted: true,
          approvalStatus: "PENDING_REVIEW",
        },
        update: {
          ...profileData,
          profileCompleted: true,
          approvalStatus: "PENDING_REVIEW",
          adminNotes: null,
        },
      }),
    ]);

    await notifyAllAdmins({
      titleAr: "طلب مدرب جديد",
      titleEn: "New Instructor Request",
      messageAr: `${name} أكمل ملفه وينتظر الموافقة.`,
      messageEn: `${name} completed their profile and awaits approval.`,
      type: "instructor_request",
      link: "/admin/instructors",
    });

    revalidatePath("/admin/instructors");
    revalidatePath("/pending-approval");

    return { success: true, redirectTo: "/pending-approval" };
  } catch (error) {
    console.error("Instructor profile error:", error);
    return { error: "Please fill all required fields correctly." };
  }
}

export async function getAcademicOptions() {
  const universities = await db.university.findMany({
    where: { status: "ACTIVE" },
    include: {
      faculties: {
        where: { status: "ACTIVE" },
        include: {
          departments: {
            where: { status: "ACTIVE" },
            orderBy: { nameAr: "asc" },
          },
        },
        orderBy: { nameAr: "asc" },
      },
    },
    orderBy: { nameAr: "asc" },
  });
  return universities;
}
