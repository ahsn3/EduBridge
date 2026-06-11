"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/hooks/use-locale";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PricingPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  price: number;
  featuresAr: string[];
  featuresEn: string[];
  isPopular: boolean;
}

export function Pricing({ plans }: { plans: PricingPlan[] }) {
  const { t, locale } = useLocale();

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t.pricing.title}</h2>
          <p className="text-muted-foreground text-lg">{t.pricing.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const features = locale === "ar" ? plan.featuresAr : plan.featuresEn;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative hover-lift",
                  plan.isPopular && "border-primary shadow-xl scale-105"
                )}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 gradient-primary border-0">
                    {t.pricing.popular}
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">
                    {locale === "ar" ? plan.nameAr : plan.nameEn}
                  </CardTitle>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.price, locale === "ar" ? "ar-TR" : "en-US")}
                    </span>
                    <span className="text-muted-foreground">{t.pricing.perMonth}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={cn("w-full", plan.isPopular && "gradient-primary border-0")}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    <Link href="/register">{t.pricing.getStarted}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
