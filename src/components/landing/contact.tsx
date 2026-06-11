"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function Contact() {
  const { t, locale } = useLocale();

  const contactItems = [
    {
      icon: Mail,
      label: locale === "ar" ? "البريد الإلكتروني" : "Email",
      value: "info@edubridge.com",
      href: "mailto:info@edubridge.com",
    },
    {
      icon: Phone,
      label: locale === "ar" ? "الهاتف" : "Phone",
      value: "+90 555 123 4567",
      href: "tel:+905551234567",
    },
    {
      icon: MapPin,
      label: locale === "ar" ? "الموقع" : "Location",
      value: locale === "ar" ? "إسطنبول، تركيا" : "Istanbul, Turkey",
    },
    {
      icon: Clock,
      label: locale === "ar" ? "ساعات العمل" : "Working Hours",
      value: locale === "ar" ? "الأحد - الخميس: 9:00 - 18:00" : "Sun - Thu: 9:00 AM - 6:00 PM",
    },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.nav.contact}</h2>
          <p className="text-muted-foreground text-lg">{t.contact.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border bg-card p-6 flex items-start gap-4 shadow-sm"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-medium hover:text-primary transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
