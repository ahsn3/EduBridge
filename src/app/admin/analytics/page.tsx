import { getAnalytics } from "@/actions/admin";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">التحليلات</h1>
        <p className="text-muted-foreground">إحصائيات المنصة</p>
      </div>
      <AnalyticsCharts
        monthlyEnrollments={data.monthlyEnrollments}
        monthlyRevenue={data.monthlyRevenue}
        coursesByEnrollments={data.coursesByEnrollments}
      />
    </div>
  );
}
