import { db } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin-emails";

export async function ensureAdminUser(email: string) {
  if (!isAdminEmail(email)) return null;

  return db.user.update({
    where: { email: email.toLowerCase().trim() },
    data: {
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
    select: {
      id: true,
      role: true,
      status: true,
      email: true,
    },
  });
}
