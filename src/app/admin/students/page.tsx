import { getUsers } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatDate } from "@/lib/utils";

export default async function AdminStudentsPage() {
  const students = await getUsers("STUDENT");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة الطلاب</h1>
        <p className="text-muted-foreground">{students.length} طالب</p>
      </div>

      <div className="grid gap-3">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={student.avatar || undefined} />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {student._count.enrollments} دورات
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(student.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
