"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { generateReferralCode } from "@/lib/utils";
import { signIn } from "@/lib/auth";
import { AUTH_INTENT_COOKIE } from "@/lib/auth-utils";
import { AuthError } from "next-auth";

export async function registerStudent(formData: FormData) {
  return registerUser(formData, "STUDENT");
}

export async function registerInstructor(formData: FormData) {
  return registerUser(formData, "INSTRUCTOR");
}

async function registerUser(
  formData: FormData,
  role: "STUDENT" | "INSTRUCTOR"
) {
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

    const existing = await db.user.findUnique({
      where: { email: validated.email },
    });

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

    await db.user.create({
      data: {
        name: validated.name,
        nameAr: validated.name,
        nameEn: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
        status: validated.role === "INSTRUCTOR" ? "PENDING" : "ACTIVE",
        referralCode,
        referredBy,
      },
    });

    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return {
      success: true,
      pending: validated.role === "INSTRUCTOR",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Registration failed" };
    }
    console.error("Register error:", error);
    return { error: "Something went wrong" };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await db.user.findUnique({ where: { email } });
    if (user?.status === "INACTIVE") {
      return { error: "Account is deactivated. Contact admin." };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch {
    return { error: "Invalid email or password" };
  }
}

export async function setAuthIntent(intent: "login" | "student" | "instructor") {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_INTENT_COOKIE, intent, {
    path: "/",
    maxAge: 300,
    sameSite: "lax",
  });
}
