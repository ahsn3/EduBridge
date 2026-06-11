"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Users, Calendar, TrendingUp } from "lucide-react";
import { BRAND } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

export function Hero() {
  const { t, isRtl } = useLocale();
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 start-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.common.tagline}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t.hero.title.split(" ").slice(0, 3).join(" ")}{" "}
              <span className="gradient-text">
                {t.hero.title.split(" ").slice(3).join(" ")}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="gradient-primary border-0 shadow-xl">
                <Link href="/register">
                  {t.hero.cta}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#courses">{t.hero.ctaSecondary}</a>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl gradient-primary opacity-10" />
              <div className="absolute inset-4 rounded-3xl border-2 border-dashed border-primary/20" />

              <div className="absolute top-8 start-8 glass-card p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2,450+</p>
                    <p className="text-xs text-muted-foreground">{t.hero.studentsOnline}</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 end-0 glass-card p-4 -translate-y-1/2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">48</p>
                    <p className="text-xs text-muted-foreground">{t.hero.upcomingClasses}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 start-16 glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-muted-foreground">{t.hero.successRate}</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full gradient-primary opacity-20 blur-2xl" />
                <div className="absolute rounded-2xl glass-card p-4 flex items-center justify-center">
                  <Image
                    src={BRAND.logoFull}
                    alt="EduBridge"
                    width={240}
                    height={120}
                    className="h-28 w-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
