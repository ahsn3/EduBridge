import { getAcademicTree } from "@/actions/academics";
import { AdminAcademicsPanel } from "@/components/admin/admin-academics-panel";

export default async function AdminAcademicsPage() {
  const tree = await getAcademicTree();
  return <AdminAcademicsPanel tree={tree} />;
}
