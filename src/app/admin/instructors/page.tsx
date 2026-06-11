import { getUsers } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export default async function AdminInstructorsPage() {
  const instructors = await getUsers("INSTRUCTOR");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة المدربين</h1>
        <p className="text-muted-foreground">{instructors.length} مدرب</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {instructors.map((instructor) => (
          <Card key={instructor.id}>
            <CardContent className="p-5 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={instructor.avatar || undefined} />
                <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{instructor.name}</p>
                <p className="text-sm text-muted-foreground">{instructor.email}</p>
              </div>
              <Badge>{instructor._count.courses} دورات</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
