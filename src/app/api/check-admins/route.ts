import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_EMAILS = ["ahmed@admin.com", "draz@admin.com"];

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  const setupKey = process.env.ADMIN_SETUP_KEY || "edubridge2026";

  if (key !== setupKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.user.findMany({
    where: { email: { in: ADMIN_EMAILS } },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { email: "asc" },
  });

  return NextResponse.json({
    found: users.length,
    users,
    missing: ADMIN_EMAILS.filter((e) => !users.some((u) => u.email === e)),
  });
}
