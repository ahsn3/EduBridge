import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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
];

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  const setupKey = process.env.ADMIN_SETUP_KEY || "edubridge2026";

  if (key !== setupKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();
  const verified = new Date();
  const created: string[] = [];

  try {
    for (const admin of ADMINS) {
      const hashed = await bcrypt.hash(admin.password, 12);
      await prisma.user.upsert({
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
      created.push(admin.email);
    }

    return NextResponse.json({
      success: true,
      message: "Admin accounts created. Login with ahmed@admin.com / Ahmed123",
      emails: created,
    });
  } catch (error) {
    console.error("Setup admins error:", error);
    return NextResponse.json(
      { error: "Failed to create admins. Check DATABASE_URL and run prisma db push." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
