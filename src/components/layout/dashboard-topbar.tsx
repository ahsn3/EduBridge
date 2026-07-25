"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLocale } from "@/hooks/use-locale";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DashboardTopbarProps {
  sidebarCollapsed: boolean;
  onMenuClick?: () => void;
  notificationCount?: number;
  settingsPath?: string;
}

export function DashboardTopbar({
  sidebarCollapsed,
  onMenuClick,
  notificationCount = 0,
  settingsPath = "/student/settings",
}: DashboardTopbarProps) {
  const { data: session } = useSession();
  const { t, locale, isRtl } = useLocale();
  const [search, setSearch] = useState("");

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "";
  const isAdmin = session?.user?.role === "ADMIN";
  const isInstructor = session?.user?.role === "INSTRUCTOR";
  const roleLabel = isAdmin
    ? t.roles.manager
    : isInstructor
      ? t.roles.instructor
      : t.roles.student;

  const notificationsPath = settingsPath.includes("/settings")
    ? settingsPath.replace("/settings", "/notifications")
    : null;

  return (
    <header
      className={cn(
        "fixed top-0 z-30 h-16 border-b bg-background/80 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed
          ? isRtl ? "right-[72px] left-0" : "left-[72px] right-0"
          : isRtl ? "right-64 left-0" : "left-64 right-0",
        isAdmin && "border-b-primary/20 bg-gradient-to-r from-background via-background to-primary/5"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl hover:bg-primary/10 hover:text-primary"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.common.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 rounded-xl bg-muted/50 border-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          {notificationsPath && (
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10 hover:text-primary" asChild>
              <Link href={notificationsPath}>
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 rounded-xl px-2 max-w-[220px] hover:bg-primary/10 data-[state=open]:bg-primary/10"
              >
                <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                  <AvatarImage src={session?.user?.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(userName || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-start min-w-0">
                  <span className="text-sm font-semibold truncate max-w-[140px]">
                    {userName}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    {isAdmin && <Shield className="h-3 w-3 text-primary" />}
                    {roleLabel}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                <p className="font-semibold text-sm truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                {isAdmin && (
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    {roleLabel}
                  </Badge>
                )}
              </div>
              <DropdownMenuItem asChild>
                <Link href={settingsPath}>{t.common.profile}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={settingsPath}>{t.common.settings}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">{t.nav.home}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
