import { getNotifications, markNotificationRead } from "@/actions/student";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Bell } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function StudentNotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الإشعارات</h1>
        <p className="text-muted-foreground">جميع إشعاراتك</p>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className={!n.readStatus ? "border-primary/30 bg-primary/5" : ""}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium">{n.titleAr || n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.messageAr || n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
                {!n.readStatus && (
                  <form action={async () => {
                    "use server";
                    await markNotificationRead(n.id);
                  }}>
                    <Button type="submit" variant="ghost" size="sm">
                      تم القراءة
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Bell} title="لا توجد إشعارات" />
      )}
    </div>
  );
}
