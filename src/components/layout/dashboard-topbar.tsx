"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const { t, isRtl } = useLocale();
  const [search, setSearch] = useState("");

  return (
    <header
      className={cn(
        "fixed top-0 z-30 h-16 border-b bg-background/80 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed
          ? isRtl ? "right-[72px] left-0" : "left-[72px] right-0"
          : isRtl ? "right-64 left-0" : "left-64 right-0"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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

          <Button variant="ghost" size="icon" className="relative rounded-xl" asChild>
            <Link href={settingsPath.replace("settings", "notifications")}>
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 rounded-xl px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.avatar || undefined} />
                  <AvatarFallback>
                    {getInitials(session?.user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {session?.user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
