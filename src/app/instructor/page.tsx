import { getInstructorDashboard } from "@/actions/instructor";
import { InstructorDashboardView } from "@/components/instructor/instructor-dashboard-view";

export default async function InstructorDashboardPage() {
  const data = await getInstructorDashboard();
  if (!data) return null;

  return <InstructorDashboardView data={data} />;
}
