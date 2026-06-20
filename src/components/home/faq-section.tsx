"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { HomepageData } from "@/lib/homepage-data";

export function FaqSection({ homepage }: { homepage: HomepageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = homepage.faqs;

  return (
    <section id="faq" className="border-b border-border bg-card/50">
      <div className="page-container py-20 md:py-28 max-w-3xl">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Pertanyaan Umum
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-background overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex items-center justify-between w-full p-5 text-left hover:bg-muted/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-semibold text-foreground pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
