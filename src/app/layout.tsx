import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import {
  BRAND,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_AR,
  SITE_NAME,
  getAbsoluteUrl,
} from "@/lib/site-config";
import { getRequestSiteUrl } from "@/lib/site-url";
import { getServerLocale } from "@/lib/i18n/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getRequestSiteUrl();
  const ogImage = getAbsoluteUrl(BRAND.ogImage, siteUrl);
  const openGraphImage = getAbsoluteUrl("/opengraph-image.jpg", siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${SITE_NAME} | Professional Education for Arab Students`,
      template: `%s | ${SITE_NAME}`,
    },
    description: `${SITE_DESCRIPTION} ${SITE_DESCRIPTION_AR}`,
    keywords: [
      "EduBridge",
      "education",
      "turkey",
      "arab students",
      "online courses",
      "تعليم",
      "الطلاب العرب",
    ],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    icons: {
      icon: [{ url: BRAND.logo }, { url: "/icon.jpg", type: "image/jpeg" }],
      shortcut: BRAND.logo,
      apple: [{ url: "/apple-icon.jpg", type: "image/jpeg" }],
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_TR"],
      url: siteUrl,
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Professional Education for Arab Students`,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1024,
          height: 1024,
          alt: SITE_NAME,
          type: "image/jpeg",
        },
        {
          url: openGraphImage,
          secureUrl: openGraphImage,
          width: 1024,
          height: 1024,
          alt: SITE_NAME,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [ogImage, openGraphImage],
    },
    other: {
      "og:image": ogImage,
      "og:image:secure_url": ogImage,
      "og:image:url": ogImage,
      "og:image:width": "1024",
      "og:image:height": "1024",
      "og:image:type": "image/jpeg",
      "og:image:alt": SITE_NAME,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
