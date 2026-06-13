const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

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

    const check = await prisma.user.findUnique({
      where: { email: admin.email },
      select: { email: true, role: true, status: true },
    });
    console.log(`Admin ready: ${check.email} role=${check.role} status=${check.status}`);
  }
}

main()
  .catch((e) => {
    console.error("ensure-admins failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
