import { getUsers } from "@/actions/admin";
import { UserActions } from "@/components/admin/user-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export default async function AdminInstructorsPage() {
  const instructors = await getUsers("INSTRUCTOR");
  const pending = instructors.filter((i) => i.status === "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Instructor Management</h1>
        <p className="text-muted-foreground">
          {instructors.length} instructors · {pending.length} pending approval
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-amber-600">Pending Approval</h2>
          {pending.map((instructor) => (
            <Card key={instructor.id} className="border-amber-500/30">
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
                <UserActions
                  userId={instructor.id}
                  role={instructor.role}
                  status={instructor.status}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold">All Instructors</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {instructors
            .filter((i) => i.status !== "PENDING")
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
                    <Badge variant="secondary">{instructor._count.courses} courses</Badge>
                    <UserActions
                      userId={instructor.id}
                      role={instructor.role}
                      status={instructor.status}
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
