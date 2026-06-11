"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { toast } from "sonner";

export function Contact() {
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(t.common.success);
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.nav.contact}</h2>
              <p className="text-muted-foreground text-lg">{t.footer.description}</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "info@edubridge.com" },
                { icon: Phone, label: "+90 555 123 4567" },
                { icon: MapPin, label: locale === "ar" ? "إسطنبول، تركيا" : "Istanbul, Turkey" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.auth.name}</Label>
                    <Input required name="name" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.auth.email}</Label>
                    <Input required type="email" name="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "الموضوع" : "Subject"}</Label>
                  <Input required name="subject" />
                </div>
                <div className="space-y-2">
                  <Label>{locale === "ar" ? "الرسالة" : "Message"}</Label>
                  <Textarea required name="message" rows={5} />
                </div>
                <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
                  <Send className="h-4 w-4" />
                  {loading ? t.common.loading : t.common.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
