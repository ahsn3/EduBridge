import { getAdminDashboard } from "@/actions/admin";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  if (!data) return null;

  return <AdminDashboardView data={data} />;
}
