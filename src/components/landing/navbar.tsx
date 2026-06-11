"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLocale } from "@/hooks/use-locale";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { t } = useLocale();

  const dashboardPath =
    session?.user?.role === "ADMIN"
      ? "/admin"
      : session?.user?.role === "INSTRUCTOR"
        ? "/instructor"
        : "/student";

  const getNavLabel = (key: string) => {
    const nav = t.nav as Record<string, string>;
    return nav[key] || key;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">EB</span>
          </div>
          <span className="font-bold text-xl">{t.common.appName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {getNavLabel(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {session ? (
            <Button asChild>
              <Link href={dashboardPath}>{t.nav.dashboard}</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{t.nav.login}</Link>
              </Button>
              <Button asChild className="gradient-primary border-0">
                <Link href="/register">{t.nav.register}</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "lg:hidden border-t bg-background overflow-hidden transition-all duration-300",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {getNavLabel(link.labelKey)}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {session ? (
            <Button asChild className="w-full">
              <Link href={dashboardPath}>{t.nav.dashboard}</Link>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/login">{t.nav.login}</Link>
              </Button>
              <Button asChild className="flex-1 gradient-primary border-0">
                <Link href="/register">{t.nav.register}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
