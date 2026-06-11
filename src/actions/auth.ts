"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { generateReferralCode } from "@/lib/utils";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
  try {
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      role: (formData.get("role") as "STUDENT" | "INSTRUCTOR") || "STUDENT",
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
        referralCode,
        referredBy,
      },
    });

    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return { success: true };
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
