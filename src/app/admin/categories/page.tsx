import { getAllCategories } from "@/actions/admin";
import { AdminCategoriesPanel } from "@/components/admin/admin-categories-panel";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  return <AdminCategoriesPanel categories={categories} />;
}
