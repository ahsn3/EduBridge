import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { CoursesSection } from "@/components/landing/courses-section";
import { InstructorsSection } from "@/components/landing/instructors-section";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { db } from "@/lib/db";
import { CategoriesSection } from "@/components/landing/categories-section";

export const dynamic = "force-dynamic";

async function getLandingData() {
  try {
    const [courses, instructors, testimonials, pricingPlans, categories] = await Promise.all([
      db.course.findMany({
        where: { isPublished: true },
        take: 6,
        include: {
          instructor: { select: { name: true, avatar: true } },
          _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.findMany({
        where: { role: "INSTRUCTOR" },
        take: 4,
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
          bioAr: true,
          bioEn: true,
          _count: { select: { courses: true } },
        },
      }),
      db.testimonial.findMany({ where: { isActive: true }, take: 6 }),
      db.pricingPlan.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    const plans = pricingPlans.map((p) => ({
      ...p,
      featuresAr: p.featuresAr as string[],
      featuresEn: p.featuresEn as string[],
    }));

    return { courses, instructors, testimonials, pricingPlans: plans, categories };
  } catch {
    return { courses: [], instructors: [], testimonials: [], pricingPlans: [], categories: [] };
  }
}

export default async function HomePage() {
  const { courses, instructors, testimonials, pricingPlans, categories } = await getLandingData();

  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      {categories.length > 0 && <CategoriesSection categories={categories} />}
      <CoursesSection courses={courses} />
      <InstructorsSection instructors={instructors} />
      <Testimonials testimonials={testimonials} />
      {pricingPlans.length > 0 && <Pricing plans={pricingPlans} />}
      <div id="faq">
        <FAQ />
      </div>
      <Contact />
      <Footer />
    </main>
  );
}
