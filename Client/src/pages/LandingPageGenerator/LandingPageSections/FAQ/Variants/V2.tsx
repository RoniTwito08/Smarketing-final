// src/components/LandingPageSections/FAQ/Variants/V2.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import s from "../faq.module.css";
import type { QA } from "../FAQ";

export default function V2({
  items,
  options,
}: {
  items: QA[];
  options: {
    columns: "auto" | "single" | "double";
    density: "compact" | "normal" | "spacious";
    expandMode: "details" | "accordion";
    showNumbers: boolean;
    equalHeights: boolean;
  };
}) {
  const colsCls = options.columns === "single" ? (s as any)["columns-1"] : options.columns === "double" ? (s as any)["columns-2"] : (s as any)["columns-auto"];
  const densCls = options.density === "compact" ? s.compact : options.density === "spacious" ? s.spacious : s.normal;

  // אם expandMode === "accordion" — רק אחד פתוח
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    panelsRef.current.forEach((el, i) => {
      if (!el) return;
      const isOpen = openIndex === i;
      el.classList.toggle(s.open, isOpen);
      el.style.maxHeight = isOpen ? el.scrollHeight + "px" : "0px";
    });
  }, [openIndex]);

  return (
    <div className={`${s.grid} ${colsCls} ${densCls} ${options.equalHeights ? s.equalHeights : ""}`}>
      {items.map((qa, i) => {
        const active = openIndex === i;
        return (
          <div key={i} className={`${s.card} ${active ? s.open : ""}`}>
            <button
              className={`${s.accHead} ${active ? s.open : ""}`}
              type="button"
              onClick={() => {
                if (options.expandMode === "accordion") {
                  setOpenIndex(active ? null : i);
                } else {
                  // מצב "details" אינו רלוונטי פה; נשמר התנהגות אקורדיון כברירת מחדל
                  setOpenIndex(active ? null : i);
                }
              }}
              aria-expanded={active}
              aria-controls={`faq-panel-${i}`}
            >
              {options.showNumbers && <span className={s.num}>{i + 1}</span>}
              {qa.q}
            </button>
            <div
              id={`faq-panel-${i}`}
              ref={(el) => { if (el) panelsRef.current[i] = el; }}
              className={s.accPanel}
              role="region"
              aria-hidden={!active}
            >
              <p className={s.a}>{qa.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
