"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { MobileBottomNav } from "./mobile-bottom-nav";

interface NavItem {
  href: string;
  icon: string;
  labelKey: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: readonly NavItem[];
  settingsPath?: string;
  notificationCount?: number;
  showMobileNav?: boolean;
}

export function DashboardShell({
  children,
  navItems,
  settingsPath,
  notificationCount,
  showMobileNav = false,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isRtl } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <DashboardSidebar
          navItems={navItems}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <DashboardSidebar
            navItems={navItems}
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
          />
        </div>
      )}

      <DashboardTopbar
        sidebarCollapsed={collapsed}
        onMenuClick={() => setMobileOpen(true)}
        notificationCount={notificationCount}
        settingsPath={settingsPath}
      />

      <main
        className={cn(
          "pt-16 pb-20 lg:pb-6 transition-all duration-300 min-h-screen",
          collapsed
            ? isRtl ? "lg:mr-[72px]" : "lg:ml-[72px]"
            : isRtl ? "lg:mr-64" : "lg:ml-64"
        )}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">{children}</div>
      </main>

      {showMobileNav && <MobileBottomNav navItems={navItems.slice(0, 5)} />}
    </div>
  );
}
