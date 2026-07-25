"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocale } from "@/hooks/use-locale";
import { getInitials } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/animated-section";

interface Testimonial {
  id: string;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  role: string;
  roleAr?: string | null;
  roleEn?: string | null;
  contentAr: string;
  contentEn: string;
  avatar?: string | null;
  rating: number;
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { t, locale } = useLocale();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">{t.landing.testimonialsTitle}</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {testimonials.map((item) => {
            const name = locale === "ar" ? item.nameAr || item.name : item.nameEn || item.name;
            const role = locale === "ar" ? item.roleAr || item.role : item.roleEn || item.role;
            const content = locale === "ar" ? item.contentAr : item.contentEn;

            return (
              <Card key={item.id} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed">&ldquo;{content}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
