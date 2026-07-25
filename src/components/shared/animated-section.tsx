"use client";

import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <div
      className={cn("animate-fade-in-up", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function AnimatedPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("animate-fade-in space-y-8", className)}>
      {children}
    </div>
  );
}
