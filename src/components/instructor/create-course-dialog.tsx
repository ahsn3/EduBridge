"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCourse } from "@/actions/courses";
import { toast } from "sonner";

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("beginner");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCourse(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("تم إنشاء الدورة");
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4" />
          إنشاء دورة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء دورة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>العنوان (عربي)</Label>
              <Input name="titleAr" required />
            </div>
            <div className="space-y-2">
              <Label>العنوان (إنجليزي)</Label>
              <Input name="titleEn" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>الوصف (عربي)</Label>
            <Textarea name="descriptionAr" required rows={3} />
          </div>
          <div className="space-y-2">
            <Label>الوصف (إنجليزي)</Label>
            <Textarea name="descriptionEn" required rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>السعر (TRY)</Label>
              <Input name="price" type="number" min="0" defaultValue="0" />
            </div>
            <div className="space-y-2">
              <Label>المدة (ساعات)</Label>
              <Input name="duration" type="number" min="0" defaultValue="10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>المستوى</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">مبتدئ</SelectItem>
                <SelectItem value="intermediate">متوسط</SelectItem>
                <SelectItem value="advanced">متقدم</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="level" value={level} />
          </div>
          <div className="space-y-2">
            <Label>رابط الصورة</Label>
            <Input name="thumbnail" placeholder="https://..." />
          </div>
          <input type="hidden" name="isPublished" value="true" />
          <Button type="submit" disabled={loading} className="w-full gradient-primary border-0">
            {loading ? "جاري الإنشاء..." : "إنشاء الدورة"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
