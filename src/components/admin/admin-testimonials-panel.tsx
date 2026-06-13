"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
} from "@/actions/admin";
import { useLocale } from "@/hooks/use-locale";

type Testimonial = {
  id: string;
  nameAr: string | null;
  nameEn: string | null;
  roleAr: string | null;
  roleEn: string | null;
  contentAr: string;
  contentEn: string;
  avatar: string | null;
  rating: number;
  isActive: boolean;
};

function TestimonialForm({
  item,
  onDone,
}: {
  item?: Testimonial;
  onDone: () => void;
}) {
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(item?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", String(isActive));
    const result = item
      ? await updateTestimonial(item.id, formData)
      : await createTestimonial(formData);

    if (result.error) toast.error(result.error);
    else {
      toast.success(t.common.success);
      onDone();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{locale === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
          <Input name="nameAr" defaultValue={item?.nameAr || ""} required />
        </div>
        <div className="space-y-2">
          <Label>{locale === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
          <Input name="nameEn" defaultValue={item?.nameEn || ""} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{locale === "ar" ? "الدور (عربي)" : "Role (Arabic)"}</Label>
          <Input name="roleAr" defaultValue={item?.roleAr || ""} required />
        </div>
        <div className="space-y-2">
          <Label>{locale === "ar" ? "الدور (إنجليزي)" : "Role (English)"}</Label>
          <Input name="roleEn" defaultValue={item?.roleEn || ""} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "المحتوى (عربي)" : "Content (Arabic)"}</Label>
        <Textarea name="contentAr" defaultValue={item?.contentAr} required rows={3} />
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "المحتوى (إنجليزي)" : "Content (English)"}</Label>
        <Textarea name="contentEn" defaultValue={item?.contentEn} required rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{locale === "ar" ? "رابط الصورة" : "Avatar URL"}</Label>
          <Input name="avatar" defaultValue={item?.avatar || ""} />
        </div>
        <div className="space-y-2">
          <Label>{locale === "ar" ? "التقييم" : "Rating"}</Label>
          <Input name="rating" type="number" min="1" max="5" defaultValue={item?.rating ?? 5} />
        </div>
      </div>
      {item && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="isActive">{t.admin.active}</Label>
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full gradient-primary border-0">
        {loading ? t.common.loading : item ? t.common.save : t.admin.addTestimonial}
      </Button>
    </form>
  );
}

export function AdminTestimonialsPanel({ testimonials }: { testimonials: Testimonial[] }) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);

  function refresh() {
    router.refresh();
    setCreateOpen(false);
    setEditItem(null);
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      const result = await toggleTestimonial(id);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.common.success);
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm(locale === "ar" ? "حذف هذا الرأي؟" : "Delete this testimonial?")) return;
    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.common.success);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.admin.manageTestimonials}</h1>
          <p className="text-muted-foreground">{testimonials.length} {t.admin.testimonials}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="h-4 w-4" />
              {t.admin.addTestimonial}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.admin.addTestimonial}</DialogTitle>
            </DialogHeader>
            <TestimonialForm onDone={refresh} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {testimonials.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium">{locale === "ar" ? item.nameAr : item.nameEn}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {locale === "ar" ? item.contentAr : item.contentEn}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? t.admin.active : t.admin.inactive}
                </Badge>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => handleToggle(item.id)}>
                  {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditItem(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" disabled={pending} onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.common.edit}</DialogTitle>
          </DialogHeader>
          {editItem && <TestimonialForm item={editItem} onDone={refresh} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
