"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createUniversity,
} from "@/actions/academics";
import { useLocale } from "@/hooks/use-locale";

type Tree = Awaited<ReturnType<typeof import("@/actions/academics").getAcademicTree>>;

export function AdminAcademicsPanel({ tree }: { tree: Tree }) {
  const { locale } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<string | null>(null);

  async function submit(action: (fd: FormData) => Promise<{ error?: string; success?: boolean }>, fd: FormData) {
    startTransition(async () => {
      const result = await action(fd);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Saved");
        setOpen(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {locale === "ar" ? "الهيكل الأكاديمي" : "Academic Structure"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "ar" ? "جامعات → كليات → أقسام → سنوات → مواد" : "Universities → Faculties → Departments → Years → Subjects"}
          </p>
        </div>
        <Dialog open={open === "uni"} onOpenChange={(v) => setOpen(v ? "uni" : null)}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="h-4 w-4" />
              {locale === "ar" ? "جامعة" : "University"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{locale === "ar" ? "إضافة جامعة" : "Add University"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); submit(createUniversity, new FormData(e.currentTarget)); }} className="space-y-3">
              <div><Label>الاسم (عربي)</Label><Input name="nameAr" required /></div>
              <div><Label>Name (English)</Label><Input name="nameEn" required /></div>
              <Button type="submit" disabled={pending} className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tree.map((uni) => (
          <Card key={uni.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{locale === "ar" ? uni.nameAr : uni.nameEn}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uni.faculties.map((fac) => (
                <div key={fac.id} className="border-s-2 border-primary/30 ps-4 space-y-2">
                  <p className="font-medium">{locale === "ar" ? fac.nameAr : fac.nameEn}</p>
                  {fac.departments.map((dep) => (
                    <div key={dep.id} className="ps-4 text-sm space-y-1">
                      <p className="text-muted-foreground">{locale === "ar" ? dep.nameAr : dep.nameEn}</p>
                      {dep.academicYears.map((year) => (
                        <div key={year.id} className="ps-3 flex flex-wrap gap-2">
                          <span className="text-xs font-medium">{locale === "ar" ? year.nameAr : year.nameEn}:</span>
                          {year.subjects.map((s) => (
                            <span key={s.id} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {locale === "ar" ? s.nameAr : s.nameEn}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {tree.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            {locale === "ar" ? "أضف جامعة للبدء" : "Add a university to get started"}
          </p>
        )}
      </div>
    </div>
  );
}
