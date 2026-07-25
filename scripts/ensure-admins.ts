import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMINS = [
  {
    email: "ahmed@edubridge.com",
    password: "Ahmed123",
    name: "Ahmed Admin",
    nameAr: "أحمد - مدير",
    nameEn: "Ahmed Admin",
    referralCode: "ADM001",
  },
  {
    email: "draz@edubridge.com",
    password: "Draz123",
    name: "Draz Admin",
    nameAr: "دراز - مدير",
    nameEn: "Draz Admin",
    referralCode: "ADM002",
  },
];

async function main() {
  const verified = new Date();

  for (const admin of ADMINS) {
    const hashed = await bcrypt.hash(admin.password, 12);
    const user = await prisma.user.upsert({
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
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      },
    });

    await prisma.instructorProfile.deleteMany({ where: { userId: user.id } });
    console.log(`Admin ready: ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error("ensure-admins failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
