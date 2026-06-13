import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "INSTRUCTOR"]).default("STUDENT"),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const courseSchema = z.object({
  titleAr: z.string().min(3, "Title is required"),
  titleEn: z.string().min(3, "Title is required"),
  descriptionAr: z.string().min(10, "Description is required"),
  descriptionEn: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(0),
  categoryId: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  duration: z.coerce.number().min(0).default(0),
  thumbnail: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const sessionSchema = z.object({
  courseId: z.string(),
  titleAr: z.string().min(3),
  titleEn: z.string().min(3),
  googleMeetLink: z.string().url().optional().or(z.literal("")),
  sessionDate: z.string(),
  duration: z.coerce.number().min(15).default(60),
  description: z.string().optional(),
});

export const materialSchema = z.object({
  courseId: z.string(),
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  fileUrl: z.string().url(),
  fileType: z.string().default("pdf"),
});

export const assignmentSchema = z.object({
  courseId: z.string(),
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  description: z.string().min(10),
  dueDate: z.string(),
  maxScore: z.coerce.number().min(1).default(100),
});

export const quizSchema = z.object({
  courseId: z.string(),
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  duration: z.coerce.number().min(5).default(30),
});

export const announcementSchema = z.object({
  courseId: z.string(),
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  contentAr: z.string().min(10),
  contentEn: z.string().min(10),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional(),
  locale: z.enum(["ar", "en"]).default("ar"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    token: z.string().min(10),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const instructorProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
  departmentId: z.string().optional(),
  universityName: z.string().optional(),
  facultyName: z.string().optional(),
  departmentName: z.string().optional(),
  academicPositionAr: z.string().min(2),
  academicPositionEn: z.string().min(2),
  avatar: z.string().url().optional().or(z.literal("")),
  cvUrl: z.string().min(1, "CV is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type MaterialInput = z.infer<typeof materialSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
