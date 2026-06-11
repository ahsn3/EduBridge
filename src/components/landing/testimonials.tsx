"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";

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
  const { locale } = useLocale();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            {locale === "ar" ? "ماذا يقول طلابنا" : "What Our Students Say"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Card key={item.id} className="hover-lift">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">
                  &ldquo;{locale === "ar" ? item.contentAr : item.contentEn}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={item.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {locale === "ar" ? item.nameAr || item.name : item.nameEn || item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {locale === "ar" ? item.roleAr || item.role : item.roleEn || item.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
