import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import {
  BRAND,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_AR,
  SITE_NAME,
  getAbsoluteUrl,
  getSiteUrl,
} from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const ogImage = getAbsoluteUrl(BRAND.ogImage);

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
      icon: BRAND.logo,
      shortcut: BRAND.logo,
      apple: BRAND.logo,
    },
    openGraph: {
      type: "website",
      locale: "ar_TR",
      alternateLocale: ["en_US"],
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
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [ogImage],
    },
    other: {
      "og:image": ogImage,
      "og:image:secure_url": ogImage,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
