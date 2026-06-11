"use client";

import {
  Video,
  FileText,
  Brain,
  Award,
  Map,
  HeadphonesIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";

const features = [
  { key: "liveClasses", icon: Video, color: "bg-indigo-500/10 text-indigo-600" },
  { key: "materials", icon: FileText, color: "bg-cyan-500/10 text-cyan-600" },
  { key: "quizzes", icon: Brain, color: "bg-purple-500/10 text-purple-600" },
  { key: "certificates", icon: Award, color: "bg-amber-500/10 text-amber-600" },
  { key: "journey", icon: Map, color: "bg-emerald-500/10 text-emerald-600" },
  { key: "support", icon: HeadphonesIcon, color: "bg-rose-500/10 text-rose-600" },
] as const;

export function Features() {
  const { t } = useLocale();

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t.features.title}</h2>
          <p className="text-muted-foreground text-lg">{t.features.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const title = t.features[feature.key as keyof typeof t.features] as string;
            const descKey = `${feature.key}Desc` as keyof typeof t.features;
            const desc = t.features[descKey] as string;

            return (
              <Card key={feature.key} className="hover-lift border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
