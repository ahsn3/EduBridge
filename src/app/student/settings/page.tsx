import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/student/profile-form";

export default async function StudentSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة ملفك الشخصي</p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
