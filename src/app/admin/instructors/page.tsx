import { getInstructorsWithProfile } from "@/actions/admin";
import { InstructorActions } from "@/components/admin/instructor-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";

export default async function AdminInstructorsPage() {
  const instructors = await getInstructorsWithProfile();
  const pending = instructors.filter(
    (i) => i.instructorProfile?.approvalStatus === "PENDING_REVIEW"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة المدربين</h1>
        <p className="text-muted-foreground">
          {instructors.length} مدرب · {pending.length} بانتظار الموافقة
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-amber-600">طلبات بانتظار الموافقة</h2>
          {pending.map((instructor) => (
            <Card key={instructor.id} className="border-amber-500/30">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={instructor.avatar || undefined} />
                      <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{instructor.name}</p>
                      <p className="text-sm text-muted-foreground">{instructor.email}</p>
                      {instructor.phone && (
                        <p className="text-sm text-muted-foreground">{instructor.phone}</p>
                      )}
                    </div>
                  </div>
                  <InstructorActions
                    userId={instructor.id}
                    status={instructor.status}
                    approvalStatus={instructor.instructorProfile?.approvalStatus}
                  />
                </div>
                {instructor.instructorProfile && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/50 text-sm">
                    <div>
                      <p className="text-muted-foreground">الجامعة</p>
                      <p className="font-medium">{instructor.instructorProfile.universityName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الكلية</p>
                      <p className="font-medium">{instructor.instructorProfile.facultyName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">القسم</p>
                      <p className="font-medium">{instructor.instructorProfile.departmentName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">المنصب</p>
                      <p className="font-medium">{instructor.instructorProfile.academicPositionAr || "—"}</p>
                    </div>
                    {instructor.instructorProfile.cvUrl && (
                      <div className="sm:col-span-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={instructor.instructorProfile.cvUrl} target="_blank">
                            <FileText className="h-4 w-4" />
                            عرض السيرة الذاتية
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold">جميع المدربين</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {instructors
            .filter((i) => i.instructorProfile?.approvalStatus !== "PENDING_REVIEW")
            .map((instructor) => (
              <Card key={instructor.id}>
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={instructor.avatar || undefined} />
                      <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{instructor.name}</p>
                      <p className="text-sm text-muted-foreground">{instructor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{instructor._count.courses} دورات</Badge>
                    <InstructorActions
                      userId={instructor.id}
                      status={instructor.status}
                      approvalStatus={instructor.instructorProfile?.approvalStatus}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
