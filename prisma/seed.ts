import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@edubridge.com" },
    update: { status: "ACTIVE", role: "ADMIN" },
    create: {
      name: "System Admin",
      nameAr: "مدير النظام",
      nameEn: "System Admin",
      email: "admin@edubridge.com",
      password,
      role: "ADMIN",
      status: "ACTIVE",
      referralCode: "ADM001",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
  });

  // Update these Gmail addresses to your real instructor accounts for Google Sign-In
  const instructor1 = await prisma.user.upsert({
    where: { email: "ahmed.hassan.bme@gmail.com" },
    update: { status: "ACTIVE", role: "INSTRUCTOR" },
    create: {
      name: "Dr. Ahmed Hassan",
      nameAr: "د. أحمد حسن",
      nameEn: "Dr. Ahmed Hassan",
      email: "ahmed.hassan.bme@gmail.com",
      password,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      referralCode: "AHA001",
      bio: "Assistant Professor in Biomedical Engineering",
      bioAr: "أستاذ مساعد في الهندسة الطبية الحيوية",
      bioEn: "Assistant Professor in Biomedical Engineering",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: "sara.mohammed.cs@gmail.com" },
    update: { status: "ACTIVE", role: "INSTRUCTOR" },
    create: {
      name: "Dr. Sara Mohammed",
      nameAr: "د. سارة محمد",
      nameEn: "Dr. Sara Mohammed",
      email: "sara.mohammed.cs@gmail.com",
      password,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      referralCode: "SAR001",
      bio: "Computer & Software Engineering Specialist",
      bioAr: "أخصائية في هندسة الحاسوب والبرمجيات",
      bioEn: "Computer & Software Engineering Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    },
  });

  const instructor3 = await prisma.user.upsert({
    where: { email: "omar.kaya.aero@gmail.com" },
    update: { status: "ACTIVE", role: "INSTRUCTOR" },
    create: {
      name: "Dr. Omar Kaya",
      nameAr: "د. عمر كايا",
      nameEn: "Dr. Omar Kaya",
      email: "omar.kaya.aero@gmail.com",
      password,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      referralCode: "OMR001",
      bio: "Aerospace Engineering Lecturer",
      bioAr: "محاضر في هندسة الطيران والفضاء",
      bioEn: "Aerospace Engineering Lecturer",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "student@edubridge.com" },
    update: { status: "ACTIVE", role: "STUDENT" },
    create: {
      name: "Mohammed Ali",
      nameAr: "محمد علي",
      nameEn: "Mohammed Ali",
      email: "student@edubridge.com",
      password,
      role: "STUDENT",
      status: "ACTIVE",
      referralCode: "MOH001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "fatima@edubridge.com" },
    update: { status: "ACTIVE", role: "STUDENT" },
    create: {
      name: "Fatima Ahmed",
      nameAr: "فاطمة أحمد",
      nameEn: "Fatima Ahmed",
      email: "fatima@edubridge.com",
      password,
      role: "STUDENT",
      status: "ACTIVE",
      referralCode: "FAT001",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "youssef.engineering@gmail.com" },
    update: { status: "ACTIVE", role: "STUDENT" },
    create: {
      name: "Youssef Al-Ali",
      nameAr: "يوسف العلي",
      nameEn: "Youssef Al-Ali",
      email: "youssef.engineering@gmail.com",
      password,
      role: "STUDENT",
      status: "ACTIVE",
      referralCode: "YOS001",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "software-engineering" },
      update: {},
      create: {
        name: "Software Engineering",
        nameAr: "هندسة البرمجيات",
        nameEn: "Software Engineering",
        slug: "software-engineering",
        description: "Software design, development, and architecture",
        icon: "Code",
      },
    }),
    prisma.category.upsert({
      where: { slug: "computer-engineering" },
      update: {},
      create: {
        name: "Computer Engineering",
        nameAr: "هندسة الحاسوب",
        nameEn: "Computer Engineering",
        slug: "computer-engineering",
        description: "Hardware, systems, and embedded computing",
        icon: "Cpu",
      },
    }),
    prisma.category.upsert({
      where: { slug: "aerospace-engineering" },
      update: {},
      create: {
        name: "Aerospace Engineering",
        nameAr: "هندسة الطيران والفضاء",
        nameEn: "Aerospace Engineering",
        slug: "aerospace-engineering",
        description: "Aircraft, spacecraft, and aerodynamics",
        icon: "Rocket",
      },
    }),
    prisma.category.upsert({
      where: { slug: "mechanical-engineering" },
      update: {},
      create: {
        name: "Mechanical Engineering",
        nameAr: "الهندسة الميكانيكية",
        nameEn: "Mechanical Engineering",
        slug: "mechanical-engineering",
        description: "Mechanics, thermodynamics, and manufacturing",
        icon: "Wrench",
      },
    }),
    prisma.category.upsert({
      where: { slug: "electrical-engineering" },
      update: {},
      create: {
        name: "Electrical Engineering",
        nameAr: "الهندسة الكهربائية",
        nameEn: "Electrical Engineering",
        slug: "electrical-engineering",
        description: "Circuits, power systems, and electronics",
        icon: "Zap",
      },
    }),
    prisma.category.upsert({
      where: { slug: "biomedical-engineering" },
      update: {},
      create: {
        name: "Biomedical Engineering",
        nameAr: "الهندسة الطبية الحيوية",
        nameEn: "Biomedical Engineering",
        slug: "biomedical-engineering",
        description: "Medical devices and healthcare technology",
        icon: "Heart",
      },
    }),
  ]);

  const cat = Object.fromEntries(categories.map((c) => [c.slug, c]));

  await prisma.course.deleteMany({});
  await prisma.testimonial.deleteMany({});

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "Full-Stack Software Development",
        titleAr: "تطوير البرمجيات الشامل",
        titleEn: "Full-Stack Software Development",
        description: "Learn modern software engineering from scratch",
        descriptionAr:
          "دورة شاملة في هندسة البرمجيات تشمل React و Node.js وأفضل الممارسات للطلاب العرب في تركيا.",
        descriptionEn:
          "Comprehensive software engineering course covering React, Node.js, and industry best practices.",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
        price: 599,
        level: "intermediate",
        duration: 50,
        isPublished: true,
        instructorId: instructor2.id,
        categoryId: cat["software-engineering"].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Computer Architecture & Systems",
        titleAr: "معمارية الحاسوب والأنظمة",
        titleEn: "Computer Architecture & Systems",
        description: "Deep dive into computer hardware and OS fundamentals",
        descriptionAr:
          "فهم معمارية المعالجات، الذاكرة، وأنظمة التشغيل للطلاب في تخصص هندسة الحاسوب.",
        descriptionEn:
          "Understand processors, memory hierarchy, and operating systems for computer engineering students.",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        price: 549,
        level: "intermediate",
        duration: 45,
        isPublished: true,
        instructorId: instructor2.id,
        categoryId: cat["computer-engineering"].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Introduction to Aerospace Engineering",
        titleAr: "مقدمة في هندسة الطيران",
        titleEn: "Introduction to Aerospace Engineering",
        description: "Fundamentals of flight, aerodynamics, and spacecraft",
        descriptionAr:
          "أساسيات الطيران، الديناميكا الهوائية، ومدخل إلى هندسة الفضاء للطلاب العرب.",
        descriptionEn:
          "Flight fundamentals, aerodynamics, and an introduction to space engineering.",
        thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
        price: 649,
        level: "beginner",
        duration: 40,
        isPublished: true,
        instructorId: instructor3.id,
        categoryId: cat["aerospace-engineering"].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Thermodynamics for Engineers",
        titleAr: "الديناميكا الحرارية للمهندسين",
        titleEn: "Thermodynamics for Engineers",
        description: "Core thermodynamics for mechanical engineering students",
        descriptionAr: "مبادئ الديناميكا الحرارية مع تطبيقات عملية في الهندسة الميكانيكية.",
        descriptionEn: "Thermodynamics principles with practical mechanical engineering applications.",
        thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        price: 449,
        level: "intermediate",
        duration: 35,
        isPublished: true,
        instructorId: instructor3.id,
        categoryId: cat["mechanical-engineering"].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Circuit Analysis & Electronics",
        titleAr: "تحليل الدوائر والإلكترونيات",
        titleEn: "Circuit Analysis & Electronics",
        description: "Electrical circuits and electronic systems",
        descriptionAr: "تحليل الدوائر الكهربائية والأنظمة الإلكترونية للمهندسين.",
        descriptionEn: "Electrical circuit analysis and electronic systems for engineering students.",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        price: 499,
        level: "beginner",
        duration: 38,
        isPublished: true,
        instructorId: instructor2.id,
        categoryId: cat["electrical-engineering"].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Introduction to Biomedical Engineering",
        titleAr: "مقدمة في الهندسة الطبية الحيوية",
        titleEn: "Introduction to Biomedical Engineering",
        description: "Medical devices and healthcare technology basics",
        descriptionAr:
          "دورة تأسيسية في الأجهزة الطبية وتقنيات الرعاية الصحية للطلاب العرب في تركيا.",
        descriptionEn:
          "Foundational course on medical devices and healthcare technology.",
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        price: 499,
        level: "beginner",
        duration: 40,
        isPublished: true,
        instructorId: instructor1.id,
        categoryId: cat["biomedical-engineering"].id,
      },
    }),
  ]);

  await prisma.enrollment.deleteMany({});
  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: courses[0].id, status: "ACTIVE", progress: 65 },
      { userId: student1.id, courseId: courses[5].id, status: "ACTIVE", progress: 40 },
      { userId: student1.id, courseId: courses[2].id, status: "COMPLETED", progress: 100 },
      { userId: student2.id, courseId: courses[1].id, status: "ACTIVE", progress: 45 },
      { userId: student2.id, courseId: courses[4].id, status: "ACTIVE", progress: 20 },
      { userId: student3.id, courseId: courses[0].id, status: "ACTIVE", progress: 55 },
      { userId: student3.id, courseId: courses[2].id, status: "ACTIVE", progress: 30 },
    ],
  });

  const sessionDate1 = new Date();
  sessionDate1.setDate(sessionDate1.getDate() + 2);
  const sessionDate2 = new Date();
  sessionDate2.setDate(sessionDate2.getDate() + 5);

  await prisma.liveSession.deleteMany({});
  await prisma.liveSession.createMany({
    data: [
      {
        courseId: courses[0].id,
        title: "React Fundamentals Live Session",
        titleAr: "جلسة مباشرة: أساسيات React",
        titleEn: "React Fundamentals Live Session",
        googleMeetLink: "https://meet.google.com/abc-defg-hij",
        sessionDate: sessionDate1,
        duration: 90,
      },
      {
        courseId: courses[2].id,
        title: "Aerodynamics Workshop",
        titleAr: "ورشة الديناميكا الهوائية",
        titleEn: "Aerodynamics Workshop",
        googleMeetLink: "https://meet.google.com/klm-nopq-rst",
        sessionDate: sessionDate2,
        duration: 120,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Omar Al-Khaled",
        nameAr: "عمر الخالد",
        nameEn: "Omar Al-Khaled",
        role: "Software Engineering Student - Istanbul Technical University",
        roleAr: "طالب هندسة برمجيات - جامعة إسطنبول التقنية",
        roleEn: "Software Engineering Student - Istanbul Technical University",
        content: "EduBridge helped me excel in software engineering courses",
        contentAr:
          "EduBridge ساعدني كثيراً في فهم هندسة البرمجيات. المحاضرات المباشرة والمحتوى العملي جعلوا التعلم أسهل بكثير.",
        contentEn:
          "EduBridge helped me excel in software engineering. Live sessions and practical content made learning much easier.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        rating: 5,
      },
      {
        name: "Layla Mahmoud",
        nameAr: "ليلى محمود",
        nameEn: "Layla Mahmoud",
        role: "Computer Engineering Student - METU",
        roleAr: "طالبة هندسة حاسوب - جامعة الشرق الأوسط التقنية",
        roleEn: "Computer Engineering Student - METU",
        content: "Best platform for Arab engineering students in Turkey",
        contentAr:
          "أفضل منصة للطلاب العرب في تركيا. دورة معمارية الحاسوب كانت منظمة ومفيدة جداً للامتحانات.",
        contentEn:
          "Best platform for Arab students in Turkey. The computer architecture course was well structured and exam-ready.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        rating: 5,
      },
      {
        name: "Youssef Al-Ali",
        nameAr: "يوسف العلي",
        nameEn: "Youssef Al-Ali",
        role: "Aerospace Engineering Student - ITU",
        roleAr: "طالب هندسة طيران - جامعة إسطنبول التقنية",
        roleEn: "Aerospace Engineering Student - ITU",
        content: "Excellent aerospace engineering content",
        contentAr:
          "دورة هندسة الطيران كانت ممتازة. الشرح بالعربية مع أمثلة من الجامعات التركية ساعدني أفهم المادة بسرعة.",
        contentEn:
          "The aerospace course was excellent. Arabic explanations with Turkish university examples helped me learn fast.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
        rating: 5,
      },
      {
        name: "Nour Hassan",
        nameAr: "نور حسن",
        nameEn: "Nour Hassan",
        role: "Electrical Engineering Student - Bilkent University",
        roleAr: "طالبة هندسة كهربائية - جامعة بيلكنت",
        roleEn: "Electrical Engineering Student - Bilkent University",
        content: "Great circuit analysis course",
        contentAr:
          "دورة تحليل الدوائر غطت كل ما أحتاجه للفصل. أنصح كل طالب هندسة كهربائية بالتسجيل.",
        contentEn:
          "The circuit analysis course covered everything I needed for the semester. Highly recommend for EE students.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
        rating: 5,
      },
      {
        name: "Khalid Mansour",
        nameAr: "خالد منصور",
        nameEn: "Khalid Mansour",
        role: "Mechanical Engineering Student - Yildiz Technical University",
        roleAr: "طالب هندسة ميكانيكية - جامعة يلدز التقنية",
        roleEn: "Mechanical Engineering Student - Yildiz Technical University",
        content: "Thermodynamics made simple",
        contentAr:
          "كنت أعاني من الديناميكا الحرارية، لكن شرح الدكتور عمر على EduBridge جعل المادة واضحة ومباشرة.",
        contentEn:
          "I struggled with thermodynamics, but Dr. Omar's EduBridge course made the subject clear and practical.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        rating: 5,
      },
      {
        name: "Rania Saleh",
        nameAr: "رانيا صالح",
        nameEn: "Rania Saleh",
        role: "Biomedical Engineering Student - Hacettepe University",
        roleAr: "طالبة هندسة طبية حيوية - جامعة Hacettepe",
        roleEn: "Biomedical Engineering Student - Hacettepe University",
        content: "Perfect for biomedical engineering students",
        contentAr:
          "EduBridge وفرت لي محتوى عربي احترافي في الهندسة الطبية الحيوية. الدعم والمواد ممتازة.",
        contentEn:
          "EduBridge provided professional Arabic content for biomedical engineering. Great support and materials.",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
        rating: 5,
      },
    ],
  });

  await prisma.pricingPlan.deleteMany({});
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: "Basic",
        nameAr: "الخطة الأساسية",
        nameEn: "Basic Plan",
        descriptionAr: "للطلاب المبتدئين",
        descriptionEn: "For beginner students",
        price: 99,
        features: [],
        featuresAr: ["دورة واحدة", "مواد PDF", "دعم عبر البريد", "شهادة إتمام"],
        featuresEn: ["1 Course", "PDF Materials", "Email Support", "Certificate"],
        isPopular: false,
        order: 1,
      },
      {
        name: "Pro",
        nameAr: "الخطة الاحترافية",
        nameEn: "Pro Plan",
        descriptionAr: "الأكثر شعبية للطلاب النشطين",
        descriptionEn: "Most popular for active students",
        price: 249,
        features: [],
        featuresAr: [
          "5 دورات",
          "حصص مباشرة",
          "اختبارات تفاعلية",
          "دعم 24/7",
          "شهادات معتمدة",
          "رحلة أكاديمية",
        ],
        featuresEn: [
          "5 Courses",
          "Live Sessions",
          "Interactive Quizzes",
          "24/7 Support",
          "Certified Certificates",
          "Academic Journey",
        ],
        isPopular: true,
        order: 2,
      },
      {
        name: "Enterprise",
        nameAr: "خطة المؤسسات",
        nameEn: "Enterprise Plan",
        descriptionAr: "للمجموعات والجامعات",
        descriptionEn: "For groups and universities",
        price: 599,
        features: [],
        featuresAr: [
          "دورات غير محدودة",
          "مدرب مخصص",
          "تقارير حضور",
          "API مخصص",
          "تدريب مخصص",
          "أولوية الدعم",
        ],
        featuresEn: [
          "Unlimited Courses",
          "Dedicated Instructor",
          "Attendance Reports",
          "Custom API",
          "Custom Training",
          "Priority Support",
        ],
        isPopular: false,
        order: 3,
      },
    ],
  });

  await prisma.coupon.deleteMany({});
  await prisma.coupon.createMany({
    data: [
      { code: "WELCOME20", discountType: "percentage", discountValue: 20, maxUses: 100, isActive: true },
      { code: "ENGINEER50", discountType: "fixed", discountValue: 50, maxUses: 50, isActive: true },
    ],
  });

  console.log("✅ Seed completed!");
  console.log("\n📧 Demo Accounts (password: password123):");
  console.log("  Admin:      admin@edubridge.com");
  console.log("  Instructors:");
  console.log("    ahmed.hassan.bme@gmail.com  (Biomedical)");
  console.log("    sara.mohammed.cs@gmail.com  (Software/Computer)");
  console.log("    omar.kaya.aero@gmail.com    (Aerospace)");
  console.log("  Students:");
  console.log("    student@edubridge.com");
  console.log("    fatima@edubridge.com");
  console.log("    youssef.engineering@gmail.com");
  console.log("\n💡 Update instructor emails in prisma/seed.ts to your real Gmail for Google Sign-In.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
