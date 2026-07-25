"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { completeInstructorProfile, getAcademicOptions } from "@/actions/instructor-profile";
import { toast } from "sonner";

type University = Awaited<ReturnType<typeof getAcademicOptions>>[number];

export default function CompleteInstructorProfilePage() {
  const { t, locale } = useLocale();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [uniId, setUniId] = useState("");
  const [facId, setFacId] = useState("");
  const [deptId, setDeptId] = useState("");

  useEffect(() => {
    getAcademicOptions().then(setUniversities);
  }, []);

  const selectedUni = universities.find((u) => u.id === uniId);
  const selectedFac = selectedUni?.faculties.find((f) => f.id === facId);

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setCvUrl(data.url);
        toast.success(t.common.success);
      } else toast.error(data.error || "Upload failed");
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cvUrl) {
      toast.error(locale === "ar" ? "ارفع السيرة الذاتية PDF" : "Upload your CV (PDF)");
      return;
    }
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set("cvUrl", cvUrl);
    fd.set("universityId", uniId);
    fd.set("facultyId", facId);
    fd.set("departmentId", deptId);
    const result = await completeInstructorProfile(fd);
    if (result.error) toast.error(result.error);
    else {
      await update();
      window.location.href = result.redirectTo || "/pending-approval";
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader>
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle className="text-center text-2xl">
            {locale === "ar" ? "إكمال ملف المدرب" : "Complete Instructor Profile"}
          </CardTitle>
          <CardDescription className="text-center">
            {locale === "ar"
              ? "أكمل بياناتك الأكاديمية. سيتم مراجعة حسابك من الإدارة."
              : "Complete your academic details. Your account will be reviewed by admin."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.auth.name}</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>{locale === "ar" ? "رقم الهاتف" : "Phone"}</Label>
                <Input name="phone" required />
              </div>
            </div>

            {universities.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "الجامعة" : "University"}</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={uniId}
                    onChange={(e) => { setUniId(e.target.value); setFacId(""); setDeptId(""); }}
                  >
                    <option value="">—</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>{locale === "ar" ? u.nameAr : u.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "الكلية" : "Faculty"}</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={facId}
                    onChange={(e) => { setFacId(e.target.value); setDeptId(""); }}
                    disabled={!uniId}
                  >
                    <option value="">—</option>
                    {selectedUni?.faculties.map((f) => (
                      <option key={f.id} value={f.id}>{locale === "ar" ? f.nameAr : f.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "القسم" : "Department"}</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    disabled={!facId}
                  >
                    <option value="">—</option>
                    {selectedFac?.departments.map((d) => (
                      <option key={d.id} value={d.id}>{locale === "ar" ? d.nameAr : d.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "الجامعة" : "University"}</Label>
                  <Input name="universityName" required />
                </div>
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "الكلية" : "Faculty"}</Label>
                  <Input name="facultyName" required />
                </div>
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "القسم" : "Department"}</Label>
                  <Input name="departmentName" required />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === "ar" ? "المنصب (عربي)" : "Position (Arabic)"}</Label>
                <Input name="academicPositionAr" required placeholder="أستاذ مساعد" />
              </div>
              <div className="space-y-2">
                <Label>{locale === "ar" ? "المنصب (إنجليزي)" : "Position (English)"}</Label>
                <Input name="academicPositionEn" required placeholder="Assistant Professor" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{locale === "ar" ? "صورة شخصية (رابط)" : "Profile Photo URL"}</Label>
              <Input name="avatar" type="url" placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label>{locale === "ar" ? "السيرة الذاتية (PDF)" : "CV (PDF)"}</Label>
              <Input type="file" accept="application/pdf" onChange={handleCvUpload} disabled={uploading} />
              {cvUrl && (
                <p className="text-xs text-emerald-600">
                  {locale === "ar" ? "تم الرفع ✓" : "Uploaded ✓"} {cvUrl}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full gradient-primary border-0" disabled={loading || uploading}>
              {loading ? t.common.loading : locale === "ar" ? "إرسال للمراجعة" : "Submit for Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
