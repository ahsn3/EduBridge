import { getStudentDashboard } from "@/actions/student";
import { getCurrentUser } from "@/lib/auth";
import { StudentDashboardView } from "@/components/student/student-dashboard-view";

export default async function StudentDashboardPage() {
  const [user, data] = await Promise.all([getCurrentUser(), getStudentDashboard()]);

  if (!data) return null;

  return <StudentDashboardView userName={user?.name} data={data} />;
}
