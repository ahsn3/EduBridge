"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Map,
  Bell,
  Settings,
  Users,
  GraduationCap,
  UserCheck,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";

const iconMap = {
  LayoutDashboard,
  BookOpen,
  Video,
  Map,
  Bell,
  Settings,
  Users,
  GraduationCap,
  UserCheck,
  CreditCard,
  BarChart3,
} as const;

interface NavItem {
  href: string;
  icon: string;
  labelKey: string;
}

export function MobileBottomNav({ navItems }: { navItems: readonly NavItem[] }) {
  const pathname = usePathname();
  const { t } = useLocale();

  const getLabel = (labelKey: string) => {
    const nav = t.nav as Record<string, string>;
    return nav[labelKey] || labelKey;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur-xl safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors min-w-[60px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium truncate max-w-[60px]">
                {getLabel(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
