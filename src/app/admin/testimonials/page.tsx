import { getAllTestimonials } from "@/actions/admin";
import { AdminTestimonialsPanel } from "@/components/admin/admin-testimonials-panel";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();
  return <AdminTestimonialsPanel testimonials={testimonials} />;
}
