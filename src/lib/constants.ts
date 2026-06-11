import type { Locale } from "./i18n/translations";

export const APP_NAME = "EduBridge";
export const DEFAULT_LOCALE: Locale = "ar";

export const ROLES = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
} as const;

export const COURSE_LEVELS = [
  { value: "beginner", labelAr: "مبتدئ", labelEn: "Beginner" },
  { value: "intermediate", labelAr: "متوسط", labelEn: "Intermediate" },
  { value: "advanced", labelAr: "متقدم", labelEn: "Advanced" },
] as const;

export const FAQ_ITEMS = [
  {
    questionAr: "كيف يمكنني التسجيل في الدورات؟",
    questionEn: "How can I enroll in courses?",
    answerAr:
      "يمكنك التسجيل بإنشاء حساب طالب، ثم تصفح الدورات المتاحة والضغط على زر التسجيل. يمكنك الدفع باستخدام بطاقة الائتمان أو التحويل البنكي.",
    answerEn:
      "You can enroll by creating a student account, browsing available courses, and clicking the enroll button. You can pay using credit card or bank transfer.",
  },
  {
    questionAr: "هل الحصص المباشرة مسجلة؟",
    questionEn: "Are live sessions recorded?",
    answerAr:
      "نعم، جميع الحصص المباشرة يتم تسجيلها ويمكنك الوصول إليها في أي وقت من صفحة الدورة.",
    answerEn:
      "Yes, all live sessions are recorded and you can access them anytime from the course page.",
  },
  {
    questionAr: "كيف أحصل على الشهادة؟",
    questionEn: "How do I get a certificate?",
    answerAr:
      "عند إتمام الدورة بنسبة 100% واجتياز الاختبارات، ستحصل تلقائياً على شهادة PDF يمكنك تحميلها.",
    answerEn:
      "Upon completing the course 100% and passing quizzes, you'll automatically receive a PDF certificate you can download.",
  },
  {
    questionAr: "هل يمكنني استخدام كود خصم؟",
    questionEn: "Can I use a discount code?",
    answerAr:
      "نعم، يمكنك إدخال كود الخصم أو كود الإحالة عند التسجيل في الدورة للحصول على خصم.",
    answerEn:
      "Yes, you can enter a discount or referral code when enrolling in a course to get a discount.",
  },
  {
    questionAr: "هل المنصة تدعم اللغة العربية؟",
    questionEn: "Does the platform support Arabic?",
    answerAr:
      "نعم، المنصة تدعم اللغة العربية بشكل كامل مع تصميم RTL. يمكنك التبديل بين العربية والإنجليزية في أي وقت.",
    answerEn:
      "Yes, the platform fully supports Arabic with RTL design. You can switch between Arabic and English anytime.",
  },
];

export const NAV_LINKS = [
  { href: "#features", labelKey: "features" },
  { href: "#courses", labelKey: "courses" },
  { href: "#instructors", labelKey: "instructors" },
  { href: "#pricing", labelKey: "pricing" },
  { href: "#contact", labelKey: "contact" },
] as const;

export const STUDENT_NAV = [
  { href: "/student", icon: "LayoutDashboard", labelKey: "overview" },
  { href: "/student/courses", icon: "BookOpen", labelKey: "myCourses" },
  { href: "/student/sessions", icon: "Video", labelKey: "upcomingSessions" },
  { href: "/student/journey", icon: "Map", labelKey: "academicJourney" },
  { href: "/student/notifications", icon: "Bell", labelKey: "notifications" },
  { href: "/student/settings", icon: "Settings", labelKey: "settings" },
] as const;

export const INSTRUCTOR_NAV = [
  { href: "/instructor", icon: "LayoutDashboard", labelKey: "overview" },
  { href: "/instructor/courses", icon: "BookOpen", labelKey: "manageCourses" },
  { href: "/instructor/students", icon: "Users", labelKey: "students" },
  { href: "/instructor/sessions", icon: "Video", labelKey: "sessions" },
  { href: "/instructor/settings", icon: "Settings", labelKey: "settings" },
] as const;

export const ADMIN_NAV = [
  { href: "/admin", icon: "LayoutDashboard", labelKey: "overview" },
  { href: "/admin/students", icon: "Users", labelKey: "students" },
  { href: "/admin/instructors", icon: "GraduationCap", labelKey: "instructors" },
  { href: "/admin/courses", icon: "BookOpen", labelKey: "courses" },
  { href: "/admin/enrollments", icon: "UserCheck", labelKey: "enrollments" },
  { href: "/admin/payments", icon: "CreditCard", labelKey: "payments" },
  { href: "/admin/analytics", icon: "BarChart3", labelKey: "analytics" },
] as const;
