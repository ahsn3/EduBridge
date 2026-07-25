"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/hooks/use-locale";
import { Toaster } from "sonner";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: import("@/lib/i18n/translations").Locale;
}) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LocaleProvider initialLocale={initialLocale}>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
