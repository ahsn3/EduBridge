import { getStudentDashboard } from "@/actions/student";
import { markAttendance } from "@/actions/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Video } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";

export default async function StudentSessionsPage() {
  const data = await getStudentDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الجلسات القادمة</h1>
        <p className="text-muted-foreground">انضم للحصص المباشرة</p>
      </div>

      {data && data.upcomingSessions.length > 0 ? (
        <div className="space-y-4">
          {data.upcomingSessions.map((session) => (
            <Card key={session.id} className="hover-lift">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>{session.duration} دقيقة</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {session.titleAr || session.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getLocalizedField(session.course, "title", "ar")}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {formatDateTime(session.sessionDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {session.googleMeetLink && (
                    <>
                      <form action={async () => {
                        "use server";
                        await markAttendance(session.id);
                      }}>
                        <Button type="submit" variant="outline">
                          تسجيل الحضور
                        </Button>
                      </form>
                      <Button asChild>
                        <a
                          href={session.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="h-4 w-4" />
                          انضمام للجلسة
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Video} title="لا توجد جلسات قادمة" />
      )}
    </div>
  );
}
