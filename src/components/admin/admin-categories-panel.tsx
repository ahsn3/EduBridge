"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";
import { useLocale } from "@/hooks/use-locale";

type Category = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: string | null;
  description: string | null;
  _count: { courses: number };
};

function CategoryForm({
  category,
  onDone,
}: {
  category?: Category;
  onDone: () => void;
}) {
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

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
          <Input name="nameAr" defaultValue={category?.nameAr} required />
        </div>
        <div className="space-y-2">
          <Label>{locale === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
          <Input name="nameEn" defaultValue={category?.nameEn} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input name="slug" defaultValue={category?.slug} required placeholder="software-engineering" />
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "الأيقونة" : "Icon"}</Label>
        <Input name="icon" defaultValue={category?.icon || ""} placeholder="Code" />
      </div>
      <div className="space-y-2">
        <Label>{locale === "ar" ? "الوصف" : "Description"}</Label>
        <Input name="description" defaultValue={category?.description || ""} />
      </div>
      <Button type="submit" disabled={loading} className="w-full gradient-primary border-0">
        {loading ? t.common.loading : category ? t.common.save : t.admin.addCategory}
      </Button>
    </form>
  );
}

export function AdminCategoriesPanel({ categories }: { categories: Category[] }) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);

  function refresh() {
    router.refresh();
    setCreateOpen(false);
    setEditItem(null);
  }

  function handleDelete(id: string) {
    if (!confirm(locale === "ar" ? "حذف هذا التصنيف؟" : "Delete this category?")) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
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
          <h1 className="text-2xl font-bold">{t.admin.manageCategories}</h1>
          <p className="text-muted-foreground">{categories.length} {t.admin.categories}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="h-4 w-4" />
              {t.admin.addCategory}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.admin.addCategory}</DialogTitle>
            </DialogHeader>
            <CategoryForm onDone={refresh} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{locale === "ar" ? cat.nameAr : cat.nameEn}</p>
                <p className="text-sm text-muted-foreground">{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{cat._count.courses} {t.common.courses}</Badge>
                <Button size="sm" variant="outline" onClick={() => setEditItem(cat)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.common.edit}</DialogTitle>
          </DialogHeader>
          {editItem && <CategoryForm category={editItem} onDone={refresh} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
