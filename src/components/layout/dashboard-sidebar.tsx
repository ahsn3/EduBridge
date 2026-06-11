"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
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
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

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

interface DashboardSidebarProps {
  navItems: readonly NavItem[];
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({
  navItems,
  collapsed,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { t, isRtl } = useLocale();

  const getLabel = (labelKey: string) => {
    const nav = t.nav as Record<string, string>;
    return nav[labelKey] || labelKey;
  };

  return (
    <aside
      className={cn(
        "fixed top-0 z-40 h-screen border-e bg-card transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-64",
        isRtl ? "right-0" : "left-0"
      )}
    >
      <div
        className={cn(
          "border-b",
          collapsed
            ? "flex flex-col items-center gap-1 py-3 px-2"
            : "flex h-16 items-center justify-between px-4"
        )}
      >
        {collapsed ? (
          <Logo variant="icon" imageClassName="h-8 w-8" />
        ) : (
          <Logo
            variant="icon"
            showName
            imageClassName="h-8 w-8"
            nameClassName="text-lg"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(collapsed && "h-8 w-8")}
        >
          {collapsed ? (
            isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            pathname === item.href ||
            (item.href !== "/student" &&
              item.href !== "/instructor" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? getLabel(item.labelKey) : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{getLabel(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t.common.logout}</span>}
        </Button>
      </div>
    </aside>
  );
}
