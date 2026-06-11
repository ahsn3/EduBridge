import { getInstructorSessions } from "@/actions/instructor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { getLocalizedField } from "@/lib/i18n/translations";

export default async function InstructorSessionsPage() {
  const sessions = await getInstructorSessions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة الجلسات</h1>
        <p className="text-muted-foreground">جميع جلساتك المباشرة</p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold">{session.titleAr || session.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {getLocalizedField(session.course, "title", "ar")}
                </p>
                <p className="text-sm text-primary">{formatDateTime(session.sessionDate)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {session._count.attendances} حاضر
                </Badge>
                {session.googleMeetLink && (
                  <a
                    href={session.googleMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    فتح الجلسة
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
