import { getAllEnrollments, updateEnrollmentStatus } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

const statusVariant: Record<string, "default" | "secondary" | "success" | "destructive" | "warning"> = {
  ACTIVE: "success",
  PENDING: "warning",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export default async function AdminEnrollmentsPage() {
  const enrollments = await getAllEnrollments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة التسجيلات</h1>
        <p className="text-muted-foreground">{enrollments.length} تسجيل</p>
      </div>

      <div className="grid gap-3">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{enrollment.user.name}</p>
                <p className="text-sm text-muted-foreground">{enrollment.course.titleAr}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(enrollment.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[enrollment.status]}>
                  {enrollment.status}
                </Badge>
                {enrollment.status === "PENDING" && (
                  <form action={async () => {
                    "use server";
                    await updateEnrollmentStatus(enrollment.id, "ACTIVE");
                  }}>
                    <Button type="submit" size="sm">تفعيل</Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
