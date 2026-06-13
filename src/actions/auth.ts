"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { generateReferralCode } from "@/lib/utils";
import { signIn } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";
import {
  generateOtpCode,
  getOtpExpiryDate,
  hashOtpCode,
  OTP_MAX_ATTEMPTS,
  verifyOtpCode,
} from "@/lib/otp";
import { getDashboardPath } from "@/lib/auth-utils";
import { AuthError } from "next-auth";
import type { Prisma } from "@prisma/client";

type RegisterRole = "STUDENT" | "INSTRUCTOR";

interface PendingRegistrationPayload {
  name: string;
  passwordHash: string;
  role: RegisterRole;
  referralCode: string;
  referredBy?: string;
}

function getOtpPurpose(role: RegisterRole) {
  return role === "INSTRUCTOR" ? "register_instructor" : "register_student";
}

export async function registerStudent(formData: FormData) {
  return startRegistration(formData, "STUDENT");
}

export async function registerInstructor(formData: FormData) {
  return startRegistration(formData, "INSTRUCTOR");
}

async function startRegistration(formData: FormData, role: RegisterRole) {
  try {
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      role,
      referralCode: (formData.get("referralCode") as string) || undefined,
    };

    const validated = registerSchema.parse(raw);
    const email = validated.email.toLowerCase().trim();
    const purpose = getOtpPurpose(role);

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const referralCode = generateReferralCode(validated.name);

    let referredBy: string | undefined;
    if (validated.referralCode) {
      const referrer = await db.user.findUnique({
        where: { referralCode: validated.referralCode },
      });
      if (referrer) referredBy = referrer.id;
    }

    const code = generateOtpCode();
    const codeHash = await hashOtpCode(code);

    const payload: PendingRegistrationPayload = {
      name: validated.name,
      passwordHash: hashedPassword,
      role: validated.role,
      referralCode,
      referredBy,
    };

    await db.emailOtp.deleteMany({ where: { email, purpose } });
    await db.emailOtp.create({
      data: {
        email,
        codeHash,
        purpose,
        payload: payload as unknown as Prisma.InputJsonValue,
        expiresAt: getOtpExpiryDate(),
      },
    });

    await sendOtpEmail({ email, passcode: code });

    if (process.env.DEBUG_OTP === "true") {
      console.log(`[DEBUG_OTP] ${email}: ${code}`);
    }

    return {
      success: true,
      needsVerification: true,
      email,
      role,
    };
  } catch (error) {
    console.error("Register error:", error);
    if (error instanceof Error && error.message === "EmailJS is not configured") {
      return { error: "Email service is not configured. Contact support." };
    }
    if (error instanceof Error && error.message.includes("Failed to send verification email")) {
      return { error: "Could not send verification code. Check EmailJS settings or try again." };
    }
    return { error: "Something went wrong" };
  }
}

export async function verifyEmailOtp(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const code = (formData.get("code") as string)?.trim();
    const role = formData.get("role") as RegisterRole;

    if (!email || !code || !role) {
      return { error: "Missing verification details" };
    }

    const purpose = getOtpPurpose(role);
    const record = await db.emailOtp.findFirst({
      where: { email, purpose },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return { error: "Verification code expired. Please register again." };
    }

    if (record.expiresAt < new Date()) {
      await db.emailOtp.delete({ where: { id: record.id } });
      return { error: "Verification code expired. Please register again." };
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await db.emailOtp.delete({ where: { id: record.id } });
      return { error: "Too many attempts. Please register again." };
    }

    const isValid = await verifyOtpCode(code, record.codeHash);
    if (!isValid) {
      await db.emailOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      return { error: "Invalid verification code" };
    }

    const payload = record.payload as unknown as PendingRegistrationPayload;
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email already registered" };
    }

    const user = await db.user.create({
      data: {
        name: payload.name,
        nameAr: payload.name,
        nameEn: payload.name,
        email,
        password: payload.passwordHash,
        role: payload.role,
        status: payload.role === "INSTRUCTOR" ? "PENDING" : "ACTIVE",
        emailVerified: new Date(),
        referralCode: payload.referralCode,
        referredBy: payload.referredBy,
      },
    });

    await db.emailOtp.delete({ where: { id: record.id } });

    const plainPassword = formData.get("password") as string;
    if (!plainPassword) {
      return {
        success: true,
        needsLogin: true,
        pending: user.role === "INSTRUCTOR",
        redirectTo: "/login",
      };
    }

    await signIn("credentials", {
      email,
      password: plainPassword,
      redirect: false,
    });

    return {
      success: true,
      pending: user.role === "INSTRUCTOR",
      redirectTo: getDashboardPath(user.role, user.status),
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: true,
        needsLogin: true,
        redirectTo: "/login",
        error: "Account created. Please sign in.",
      };
    }
    console.error("Verify OTP error:", error);
    return { error: "Something went wrong" };
  }
}

export async function resendEmailOtp(email: string, role: RegisterRole) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const purpose = getOtpPurpose(role);

    const record = await db.emailOtp.findFirst({
      where: { email: normalizedEmail, purpose },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return { error: "No pending registration found. Please register again." };
    }

    const code = generateOtpCode();
    const codeHash = await hashOtpCode(code);

    await db.emailOtp.update({
      where: { id: record.id },
      data: {
        codeHash,
        attempts: 0,
        expiresAt: getOtpExpiryDate(),
      },
    });

    await sendOtpEmail({ email: normalizedEmail, passcode: code });

    return { success: true };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { error: "Could not resend code. Try again." };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    if (user.status === "INACTIVE") {
      return { error: "Account is deactivated. Contact admin." };
    }

    if (!user.emailVerified && user.role !== "ADMIN") {
      return { error: "Please verify your email before signing in." };
    }

    if (!user.password) {
      return { error: "Invalid email or password" };
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return { error: "Invalid email or password" };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      redirectTo: getDashboardPath(user.role, user.status),
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Invalid email or password" };
  }
}
