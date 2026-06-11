import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@edubridge.com" },
    update: {},
    create: {
      name: "مدير النظام",
      nameAr: "مدير النظام",
      nameEn: "System Admin",
      email: "admin@edubridge.com",
      password,
      role: "ADMIN",
      referralCode: "ADM001",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
  });

  const instructor1 = await prisma.user.upsert({
    where: { email: "ahmed@edubridge.com" },
    update: {},
    create: {
      name: "د. أحمد حسن",
      nameAr: "د. أحمد حسن",
      nameEn: "Dr. Ahmed Hassan",
      email: "ahmed@edubridge.com",
      password,
      role: "INSTRUCTOR",
      referralCode: "AHA001",
      bio: "أستاذ مساعد في الهندسة الطبية الحيوية",
      bioAr: "أستاذ مساعد في الهندسة الطبية الحيوية",
      bioEn: "Assistant Professor in Biomedical Engineering",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: "sara@edubridge.com" },
    update: {},
    create: {
      name: "د. سارة محمد",
      nameAr: "د. سارة محمد",
      nameEn: "Dr. Sara Mohammed",
      email: "sara@edubridge.com",
      password,
      role: "INSTRUCTOR",
      referralCode: "SAR001",
      bio: "أخصائية في علوم الحاسوب والذكاء الاصطناعي",
      bioAr: "أخصائية في علوم الحاسوب والذكاء الاصطناعي",
      bioEn: "Computer Science and AI Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "student@edubridge.com" },
    update: {},
    create: {
      name: "محمد علي",
      nameAr: "محمد علي",
      nameEn: "Mohammed Ali",
      email: "student@edubridge.com",
      password,
      role: "STUDENT",
      referralCode: "MOH001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "fatima@edubridge.com" },
    update: {},
    create: {
      name: "فاطمة أحمد",
      nameAr: "فاطمة أحمد",
      nameEn: "Fatima Ahmed",
      email: "fatima@edubridge.com",
      password,
      role: "STUDENT",
      referralCode: "FAT001",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "engineering" },
      update: {},
      create: {
        name: "Engineering",
        nameAr: "الهندسة",
        nameEn: "Engineering",
        slug: "engineering",
        icon: "Wrench",
      },
    }),
    prisma.category.upsert({
      where: { slug: "medicine" },
      update: {},
      create: {
        name: "Medicine",
        nameAr: "الطب",
        nameEn: "Medicine",
        slug: "medicine",
        icon: "Heart",
      },
    }),
    prisma.category.upsert({
      where: { slug: "computer-science" },
      update: {},
      create: {
        name: "Computer Science",
        nameAr: "علوم الحاسوب",
        nameEn: "Computer Science",
        slug: "computer-science",
        icon: "Code",
      },
    }),
    prisma.category.upsert({
      where: { slug: "business" },
      update: {},
      create: {
        name: "Business",
        nameAr: "إدارة الأعمال",
        nameEn: "Business",
        slug: "business",
        icon: "Briefcase",
      },
    }),
  ]);

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "مقدمة في الهندسة الطبية الحيوية",
        titleAr: "مقدمة في الهندسة الطبية الحيوية",
        titleEn: "Introduction to Biomedical Engineering",
        description: "دورة شاملة في الهندسة الطبية الحيوية",
        descriptionAr:
          "دورة شاملة تغطي أساسيات الهندسة الطبية الحيوية للطلاب العرب في الجامعات التركية. تشمل المحاضرات المباشرة والمواد التعليمية والاختبارات.",
        descriptionEn:
          "A comprehensive course covering biomedical engineering fundamentals for Arab students in Turkish universities.",
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        price: 499,
        level: "beginner",
        duration: 40,
        isPublished: true,
        instructorId: instructor1.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "الذكاء الاصطناعي وتعلم الآلة",
        titleAr: "الذكاء الاصطناعي وتعلم الآلة",
        titleEn: "Artificial Intelligence & Machine Learning",
        description: "تعلم أساسيات الذكاء الاصطناعي",
        descriptionAr:
          "دورة متقدمة في الذكاء الاصطناعي وتعلم الآلة مع تطبيقات عملية ومشاريع حقيقية.",
        descriptionEn:
          "Advanced course in AI and machine learning with practical applications and real projects.",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        price: 699,
        level: "intermediate",
        duration: 60,
        isPublished: true,
        instructorId: instructor2.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "أساسيات الطب السريري",
        titleAr: "أساسيات الطب السريري",
        titleEn: "Clinical Medicine Fundamentals",
        description: "دورة في أساسيات الطب السريري",
        descriptionAr: "دورة تأسيسية في الطب السريري مصممة للطلاب العرب في تركيا.",
        descriptionEn: "Foundational clinical medicine course for Arab students in Turkey.",
        thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
        price: 0,
        level: "beginner",
        duration: 30,
        isPublished: true,
        instructorId: instructor1.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "إدارة المشاريع الريادية",
        titleAr: "إدارة المشاريع الريادية",
        titleEn: "Entrepreneurial Project Management",
        description: "تعلم إدارة المشاريع الريادية",
        descriptionAr: "دورة عملية في إدارة المشاريع الريادية وريادة الأعمال.",
        descriptionEn: "Practical course in entrepreneurial project management.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        price: 399,
        level: "intermediate",
        duration: 25,
        isPublished: true,
        instructorId: instructor2.id,
        categoryId: categories[3].id,
      },
    }),
  ]);

  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: courses[0].id, status: "ACTIVE", progress: 65 },
      { userId: student1.id, courseId: courses[1].id, status: "ACTIVE", progress: 30 },
      { userId: student1.id, courseId: courses[2].id, status: "COMPLETED", progress: 100 },
      { userId: student2.id, courseId: courses[0].id, status: "ACTIVE", progress: 45 },
      { userId: student2.id, courseId: courses[3].id, status: "ACTIVE", progress: 20 },
    ],
  });

  const sessionDate1 = new Date();
  sessionDate1.setDate(sessionDate1.getDate() + 2);
  const sessionDate2 = new Date();
  sessionDate2.setDate(sessionDate2.getDate() + 5);

  await prisma.liveSession.createMany({
    data: [
      {
        courseId: courses[0].id,
        title: "المحاضرة الأولى: مقدمة",
        titleAr: "المحاضرة الأولى: مقدمة",
        titleEn: "Lecture 1: Introduction",
        googleMeetLink: "https://meet.google.com/abc-defg-hij",
        sessionDate: sessionDate1,
        duration: 90,
      },
      {
        courseId: courses[1].id,
        title: "ورشة عمل: Python للذكاء الاصطناعي",
        titleAr: "ورشة عمل: Python للذكاء الاصطناعي",
        titleEn: "Workshop: Python for AI",
        googleMeetLink: "https://meet.google.com/klm-nopq-rst",
        sessionDate: sessionDate2,
        duration: 120,
      },
    ],
  });

  await prisma.material.createMany({
    data: [
      {
        courseId: courses[0].id,
        title: "مقدمة في الهندسة الطبية",
        titleAr: "مقدمة في الهندسة الطبية",
        titleEn: "Introduction to Biomedical Engineering",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
        order: 1,
      },
      {
        courseId: courses[1].id,
        title: "أساسيات تعلم الآلة",
        titleAr: "أساسيات تعلم الآلة",
        titleEn: "Machine Learning Basics",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
        order: 1,
      },
    ],
  });

  await prisma.assignment.create({
    data: {
      courseId: courses[0].id,
      title: "الواجب الأول",
      titleAr: "الواجب الأول: تحليل الأجهزة الطبية",
      titleEn: "Assignment 1: Medical Device Analysis",
      description: "قم بتحليل جهاز طبي واكتب تقريراً مفصلاً عنه.",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      courseId: courses[0].id,
      title: "اختبار الوحدة الأولى",
      titleAr: "اختبار الوحدة الأولى",
      titleEn: "Unit 1 Quiz",
      duration: 30,
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz.id,
        question: "ما هو تعريف الهندسة الطبية الحيوية؟",
        questionAr: "ما هو تعريف الهندسة الطبية الحيوية؟",
        questionEn: "What is the definition of biomedical engineering?",
        options: [
          "تطبيق مبادئ الهندسة في الطب",
          "دراسة الأمراض فقط",
          "تصنيع الأدوية",
          "جراحة القلب",
        ],
        correctAnswer: 0,
        order: 1,
      },
      {
        quizId: quiz.id,
        question: "أي من التالي يعتبر جهازاً طبياً؟",
        questionAr: "أي من التالي يعتبر جهازاً طبياً؟",
        questionEn: "Which of the following is a medical device?",
        options: ["مطرقة", "مقياس ضغط الدم", "قلم", "كتاب"],
        correctAnswer: 1,
        order: 2,
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        title: "مرحباً بك في إيدو بريدج",
        titleAr: "مرحباً بك في إيدو بريدج",
        titleEn: "Welcome to EduBridge",
        message: "نتمنى لك رحلة تعليمية ممتعة!",
        messageAr: "نتمنى لك رحلة تعليمية ممتعة!",
        messageEn: "We wish you an enjoyable learning journey!",
        type: "info",
      },
      {
        userId: student1.id,
        title: "جلسة قادمة",
        titleAr: "جلسة قادمة غداً",
        titleEn: "Upcoming Session Tomorrow",
        message: "لديك محاضرة في الهندسة الطبية الحيوية غداً",
        messageAr: "لديك محاضرة في الهندسة الطبية الحيوية غداً",
        messageEn: "You have a Biomedical Engineering lecture tomorrow",
        type: "info",
        link: "/student/sessions",
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        userId: student1.id,
        amount: 499,
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
        description: "Enrollment in Biomedical Engineering",
      },
      {
        userId: student1.id,
        amount: 699,
        paymentMethod: "BANK_TRANSFER",
        paymentStatus: "COMPLETED",
        description: "Enrollment in AI & ML",
      },
      {
        userId: student2.id,
        amount: 499,
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
      },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME20",
        discountType: "percentage",
        discountValue: 20,
        maxUses: 100,
        isActive: true,
      },
      {
        code: "STUDENT50",
        discountType: "fixed",
        discountValue: 50,
        maxUses: 50,
        isActive: true,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "عمر الخالد",
        nameAr: "عمر الخالد",
        nameEn: "Omar Al-Khaled",
        role: "طالب هندسة - جامعة إسطنبول",
        roleAr: "طالب هندسة - جامعة إسطنبول",
        roleEn: "Engineering Student - Istanbul University",
        content: "منصة رائعة ساعدتني كثيراً في دراستي",
        contentAr:
          "إيدو بريدج غيرت تجربتي التعليمية بالكامل. الحصص المباشرة والمواد التعليمية ممتازة، والدعم باللغة العربية يجعل التعلم أسهل بكثير.",
        contentEn:
          "EduBridge completely transformed my learning experience. Live sessions and materials are excellent, and Arabic support makes learning much easier.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        rating: 5,
      },
      {
        name: "ليلى محمود",
        nameAr: "ليلى محمود",
        nameEn: "Layla Mahmoud",
        role: "طالبة طب - جامعة أنقرة",
        roleAr: "طالبة طب - جامعة أنقرة",
        roleEn: "Medical Student - Ankara University",
        content: "أفضل منصة تعليمية للطلاب العرب",
        contentAr:
          "كطالبة طب في تركيا، وجدت في إيدو بريدج كل ما أحتاجه. المدربون محترفون والمنصة سهلة الاستخدام.",
        contentEn:
          "As a medical student in Turkey, I found everything I need in EduBridge. Professional instructors and easy-to-use platform.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        rating: 5,
      },
      {
        name: "يوسف العلي",
        nameAr: "يوسف العلي",
        nameEn: "Youssef Al-Ali",
        role: "طالب حاسوب - جامعة بيلكنت",
        roleAr: "طالب حاسوب - جامعة بيلكنت",
        roleEn: "CS Student - Bilkent University",
        content: "تجربة تعليمية متميزة",
        contentAr:
          "دورة الذكاء الاصطناعي كانت ممتازة. المحتوى عملي والمشاريع حقيقية. أنصح كل طالب عربي في تركيا بالتسجيل.",
        contentEn:
          "The AI course was excellent. Practical content and real projects. I recommend every Arab student in Turkey to enroll.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
        rating: 5,
      },
    ],
  });

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

  await prisma.certificate.create({
    data: {
      userId: student1.id,
      courseId: courses[2].id,
    },
  });

  await prisma.attendance.create({
    data: {
      userId: student1.id,
      sessionId: (await prisma.liveSession.findFirst({ where: { courseId: courses[0].id } }))!.id,
      status: "PRESENT",
      joinedAt: new Date(),
    },
  });

  console.log("✅ Seed completed!");
  console.log("\n📧 Demo Accounts:");
  console.log("  Admin: admin@edubridge.com / password123");
  console.log("  Instructor: ahmed@edubridge.com / password123");
  console.log("  Student: student@edubridge.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
