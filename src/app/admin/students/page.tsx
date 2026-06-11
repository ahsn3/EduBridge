import { getUsers } from "@/actions/admin";
import { UserActions } from "@/components/admin/user-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatDate } from "@/lib/utils";

export default async function AdminStudentsPage() {
  const students = await getUsers("STUDENT");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">{students.length} students</p>
      </div>

      <div className="grid gap-3">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{student._count.enrollments} courses</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(student.createdAt)}
                </span>
                <UserActions
                  userId={student.id}
                  role={student.role}
                  status={student.status}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
