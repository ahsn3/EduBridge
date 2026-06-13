"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations";

const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    forgotPasswordSchema.parse({ email });

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    await db.passwordReset.deleteMany({ where: { email } });
    await db.passwordReset.create({
      data: {
        email,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_EXPIRY_MS),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      await sendOtpEmail({
        email,
        passcode: resetLink,
      });
    } catch {
      console.log(`[PASSWORD_RESET] ${email}: ${resetLink}`);
    }

    return { success: true };
  } catch {
    return { error: "Invalid email address" };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const data = resetPasswordSchema.parse({
      email: formData.get("email"),
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const email = data.email.toLowerCase().trim();
    const tokenHash = hashToken(data.token);

    const record = await db.passwordReset.findFirst({
      where: { email, tokenHash, usedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return { error: "Reset link expired or invalid. Request a new one." };
    }

    const hashed = await bcrypt.hash(data.password, 12);

    await db.$transaction([
      db.user.update({ where: { email }, data: { password: hashed } }),
      db.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);

    return { success: true };
  } catch {
    return { error: "Could not reset password. Try again." };
  }
}
