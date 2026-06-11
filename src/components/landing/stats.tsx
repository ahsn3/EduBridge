"use client";

import { Users, BookOpen, GraduationCap, Star } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const stats = [
  { key: "students", value: "5,000+", icon: Users },
  { key: "courses", value: "120+", icon: BookOpen },
  { key: "instructors", value: "45+", icon: GraduationCap },
  { key: "satisfaction", value: "98%", icon: Star },
] as const;

export function Stats() {
  const { t } = useLocale();

  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const label = t.stats[stat.key as keyof typeof t.stats];
            return (
              <div key={stat.key} className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
