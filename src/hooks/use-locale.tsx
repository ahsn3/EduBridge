"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  type Locale,
  getTranslation,
  type TranslationKey,
} from "@/lib/i18n/translations";
import { DEFAULT_LOCALE } from "@/lib/constants";

const LOCALE_COOKIE = "locale";

function persistLocale(newLocale: Locale) {
  localStorage.setItem(LOCALE_COOKIE, newLocale);
  document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
  document.documentElement.lang = newLocale;
  document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKey;
  dir: "rtl" | "ltr";
  isRtl: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_COOKIE) as Locale | null;
    if (saved && (saved === "ar" || saved === "en")) {
      setLocaleState(saved);
      persistLocale(saved);
    } else {
      persistLocale(initialLocale);
    }
  }, [initialLocale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      persistLocale(newLocale);
      router.refresh();
    },
    [router]
  );

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const value: LocaleContextType = {
    locale,
    setLocale,
    t: getTranslation(locale),
    dir: locale === "ar" ? "rtl" : "ltr",
    isRtl: locale === "ar",
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
