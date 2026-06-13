import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const ADMINS = [
  {
    email: "ahmed@admin.com",
    password: "Ahmed123",
    name: "Ahmed Admin",
    nameAr: "أحمد - مدير",
    nameEn: "Ahmed Admin",
    referralCode: "ADM002",
  },
  {
    email: "draz@admin.com",
    password: "Draz123",
    name: "Draz Admin",
    nameAr: "دراز - مدير",
    nameEn: "Draz Admin",
    referralCode: "ADM003",
  },
  {
    email: "admin@edubridge.com",
    password: "password123",
    name: "System Admin",
    nameAr: "مدير النظام",
    nameEn: "System Admin",
    referralCode: "ADM001",
  },
];

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  const setupKey = process.env.ADMIN_SETUP_KEY || "edubridge2026";

  if (key !== setupKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verified = new Date();
  const fixed: string[] = [];

  try {
    for (const admin of ADMINS) {
      const hashed = await bcrypt.hash(admin.password, 12);
      const user = await db.user.upsert({
        where: { email: admin.email },
        update: {
          password: hashed,
          role: "ADMIN",
          status: "ACTIVE",
          emailVerified: verified,
        },
        create: {
          name: admin.name,
          nameAr: admin.nameAr,
          nameEn: admin.nameEn,
          email: admin.email,
          password: hashed,
          role: "ADMIN",
          status: "ACTIVE",
          emailVerified: verified,
          referralCode: admin.referralCode,
        },
      });

      await db.instructorProfile.deleteMany({ where: { userId: user.id } });
      fixed.push(admin.email);
    }

    const users = await db.user.findMany({
      where: { email: { in: fixed } },
      select: { email: true, role: true, status: true, emailVerified: true },
      orderBy: { email: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Admin accounts fixed. Sign out and sign in again.",
      users,
    });
  } catch (error) {
    console.error("Setup admins error:", error);
    return NextResponse.json(
      { error: "Failed to fix admins. Check DATABASE_URL and run prisma db push." },
      { status: 500 }
    );
  }
}
