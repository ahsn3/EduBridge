"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "@/hooks/use-locale";
import { FAQ_ITEMS } from "@/lib/constants";

export function FAQ() {
  const { t, locale } = useLocale();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t.faq.title}
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card rounded-2xl border px-6"
            >
              <AccordionTrigger className="text-start font-medium">
                {locale === "ar" ? item.questionAr : item.questionEn}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {locale === "ar" ? item.answerAr : item.answerEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
