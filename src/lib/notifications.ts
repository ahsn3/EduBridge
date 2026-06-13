import { db } from "@/lib/db";

type NotifyInput = {
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type?: string;
  link?: string;
};

export async function notifyUser(userId: string, data: NotifyInput) {
  await db.notification.create({
    data: {
      userId,
      title: data.titleAr,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      message: data.messageAr,
      messageAr: data.messageAr,
      messageEn: data.messageEn,
      type: data.type ?? "info",
      link: data.link,
    },
  });
}

export async function notifyAllAdmins(data: NotifyInput) {
  const admins = await db.user.findMany({
    where: { role: "ADMIN", status: "ACTIVE" },
    select: { id: true },
  });

  if (admins.length === 0) return;

  await db.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      title: data.titleAr,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      message: data.messageAr,
      messageAr: data.messageAr,
      messageEn: data.messageEn,
      type: data.type ?? "info",
      link: data.link,
    })),
  });
}

export async function sendApprovalEmail(email: string, approved: boolean) {
  try {
    const { sendOtpEmail } = await import("@/lib/email");
    await sendOtpEmail({
      email,
      passcode: approved ? "APPROVED" : "REJECTED",
    });
  } catch {
    // EmailJS template may not support this — notification in-app is primary
  }
}
