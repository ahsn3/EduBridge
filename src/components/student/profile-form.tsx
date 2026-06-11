"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/hooks/use-locale";
import { updateProfile } from "@/actions/student";
import { toast } from "sonner";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone?: string | null;
    bio?: string | null;
    locale: string;
    referralCode?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { t, locale: currentLocale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [locale, setLocaleValue] = useState(user.locale);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("locale", locale);
    const result = await updateProfile(formData);
    if (result.error) toast.error(result.error);
    else toast.success(t.common.success);
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.auth.name}</Label>
            <Input name="name" defaultValue={user.name} required />
          </div>
          <div className="space-y-2">
            <Label>{t.auth.email}</Label>
            <Input value={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>{currentLocale === "ar" ? "الهاتف" : "Phone"}</Label>
            <Input name="phone" defaultValue={user.phone || ""} />
          </div>
          <div className="space-y-2">
            <Label>{currentLocale === "ar" ? "نبذة" : "Bio"}</Label>
            <Textarea name="bio" defaultValue={user.bio || ""} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{t.common.language}</Label>
            <Select value={locale} onValueChange={setLocaleValue}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">{t.common.arabic}</SelectItem>
                <SelectItem value="en">{t.common.english}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {user.referralCode && (
            <div className="space-y-2">
              <Label>{currentLocale === "ar" ? "كود الإحالة" : "Referral Code"}</Label>
              <Input value={user.referralCode} disabled />
            </div>
          )}
          <Button type="submit" disabled={loading} className="gradient-primary border-0">
            {loading ? t.common.loading : t.common.save}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
