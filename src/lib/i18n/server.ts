import { cookies } from "next/headers";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { getTranslation, type Locale } from "./translations";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get("locale")?.value;
  if (saved === "ar" || saved === "en") return saved;
  return DEFAULT_LOCALE;
}

export async function getServerTranslation() {
  const locale = await getServerLocale();
  return { locale, t: getTranslation(locale) };
}
