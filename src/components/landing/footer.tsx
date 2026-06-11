"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">EB</span>
              </div>
              <span className="font-bold text-lg">{t.common.appName}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">{t.nav.home}</a></li>
              <li><a href="#courses" className="hover:text-foreground transition-colors">{t.nav.courses}</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">{t.nav.pricing}</a></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">{t.nav.login}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.support}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#contact" className="hover:text-foreground transition-colors">{t.nav.contact}</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">{t.faq.title}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span>{t.footer.privacy}</span></li>
              <li><span>{t.footer.terms}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          © {year} {t.common.appName}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
