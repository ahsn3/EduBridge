import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default async function AdminNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مركز الإشعارات</h1>
        <p className="text-muted-foreground">طلبات المدربين والأحداث الجديدة</p>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={!n.readStatus ? "border-primary/30" : ""}>
            <CardContent className="p-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{n.titleAr || n.title}</p>
                  <Badge variant="outline">{n.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.messageAr || n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDateTime(n.createdAt)}</p>
              </div>
              {n.link && (
                <Link href={n.link} className="text-sm text-primary hover:underline shrink-0">
                  عرض
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
        {notifications.length === 0 && (
          <p className="text-center text-muted-foreground py-8">لا توجد إشعارات</p>
        )}
      </div>
    </div>
  );
}
