import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateCertificatePDF } from "@/lib/certificate";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    include: { course: true, user: true },
  });

  if (!enrollment || enrollment.status !== "COMPLETED") {
    return NextResponse.json({ error: "Course not completed" }, { status: 400 });
  }

  let certificate = await db.certificate.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });

  if (!certificate) {
    certificate = await db.certificate.create({
      data: { userId: session.user.id, courseId },
    });
  }

  const pdf = generateCertificatePDF({
    studentName: enrollment.user.name,
    courseName: enrollment.course.titleAr,
    issuedDate: new Date().toLocaleDateString("ar-EG"),
    certificateId: certificate.id,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${courseId}.pdf"`,
    },
  });
}
