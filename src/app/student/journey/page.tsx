import { getAcademicJourney } from "@/actions/student";
import { AcademicJourney } from "@/components/student/academic-journey";

export default async function StudentJourneyPage() {
  const data = await getAcademicJourney();
  if (!data) return null;

  return (
    <AcademicJourney
      enrollments={data.enrollments}
      certificates={data.certificates}
      achievements={data.achievements}
    />
  );
}
