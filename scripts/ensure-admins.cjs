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
    referralCode: "ADM001",
  },
  {
    email: "draz@admin.com",
    password: "Draz123",
    name: "Draz Admin",
    nameAr: "دراز - مدير",
    nameEn: "Draz Admin",
    referralCode: "ADM002",
  },
];

const DEFAULT_STUDENT = {
  email: "student@edubridge.com",
  password: "Student123",
  name: "Demo Student",
  nameAr: "طالب تجريبي",
  nameEn: "Demo Student",
  referralCode: "STU001",
};

const DEFAULT_INSTRUCTOR = {
  email: "instructor@edubridge.com",
  password: "Instructor123",
  name: "Demo Instructor",
  nameAr: "مدرب تجريبي",
  nameEn: "Demo Instructor",
  referralCode: "INS001",
};

async function upsertAdmin(admin) {
  const hashed = await bcrypt.hash(admin.password, 12);
  const verified = new Date();

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

async function upsertStudent(student) {
  const hashed = await bcrypt.hash(student.password, 12);
  const verified = new Date();

  await prisma.user.upsert({
    where: { email: student.email },
    update: {
      password: hashed,
      role: "STUDENT",
      status: "ACTIVE",
      emailVerified: verified,
    },
    create: {
      name: student.name,
      nameAr: student.nameAr,
      nameEn: student.nameEn,
      email: student.email,
      password: hashed,
      role: "STUDENT",
      status: "ACTIVE",
      emailVerified: verified,
      referralCode: student.referralCode,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
  });

  console.log(`Student ready: ${student.email}`);
}

async function upsertInstructor(instructor) {
  const hashed = await bcrypt.hash(instructor.password, 12);
  const verified = new Date();

  const user = await prisma.user.upsert({
    where: { email: instructor.email },
    update: {
      password: hashed,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      emailVerified: verified,
    },
    create: {
      name: instructor.name,
      nameAr: instructor.nameAr,
      nameEn: instructor.nameEn,
      email: instructor.email,
      password: hashed,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      emailVerified: verified,
      referralCode: instructor.referralCode,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    },
  });

  await prisma.instructorProfile.upsert({
    where: { userId: user.id },
    update: {
      profileCompleted: true,
      approvalStatus: "APPROVED",
      academicPositionAr: "أستاذ مساعد",
      academicPositionEn: "Assistant Professor",
      universityName: "EduBridge University",
      facultyName: "Engineering",
      departmentName: "General",
      cvUrl: "/uploads/demo-cv.pdf",
    },
    create: {
      userId: user.id,
      profileCompleted: true,
      approvalStatus: "APPROVED",
      academicPositionAr: "أستاذ مساعد",
      academicPositionEn: "Assistant Professor",
      universityName: "EduBridge University",
      facultyName: "Engineering",
      departmentName: "General",
      cvUrl: "/uploads/demo-cv.pdf",
    },
  });

  console.log(`Instructor ready: ${instructor.email}`);
}

async function main() {
  for (const admin of ADMINS) {
    await upsertAdmin(admin);
  }
  await upsertStudent(DEFAULT_STUDENT);
  await upsertInstructor(DEFAULT_INSTRUCTOR);
}

main()
  .catch((e) => {
    console.error("ensure-admins failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
