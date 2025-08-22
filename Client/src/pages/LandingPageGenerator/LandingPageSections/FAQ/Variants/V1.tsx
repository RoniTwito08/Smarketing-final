// src/components/LandingPageSections/FAQ/Variants/V1.tsx
"use client";
import { useState } from "react";
import s from "../faq.module.css";

export default function V1({
  items,
  options,
}: {
  items: { q: string; a: string }[];
  options: { columns: "auto" | "single" | "double"; density: "compact"|"normal"|"spacious"; equalHeights?: boolean };
}) {
  const colsCls = options.columns === "double" ? s["columns-2"] : options.columns === "single" ? s["columns-1"] : s["columns-auto"];
  const densityCls = options.density === "compact" ? s.compact : options.density === "spacious" ? s.spacious : s.normal;

  // שליטה: רק סעיף אחד פתוח בכל זמן + סטייט טקסטים לעריכה
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [local, setLocal] = useState(items);

  const onQInput = (i:number) => (e:React.FormEvent<HTMLSpanElement>) => {
    const v = (e.currentTarget as HTMLSpanElement).innerText;
    setLocal(prev => { const next=[...prev]; next[i]={...next[i], q:v}; return next; });
  };
  const onAInput = (i:number) => (e:React.FormEvent<HTMLDivElement>) => {
    const v = (e.currentTarget as HTMLDivElement).innerText;
    setLocal(prev => { const next=[...prev]; next[i]={...next[i], a:v}; return next; });
  };

  return (
    <div className={`${s.v1Wrap ?? ""} ${s.grid} ${colsCls} ${densityCls} ${options.equalHeights ? s.equalHeights : ""}`}>
      {local.map((qa, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={`${s.card} ${isOpen ? s.open : ""}`}>
            <details open={isOpen} onToggle={(e) => {
              const nextOpen = (e.currentTarget as HTMLDetailsElement).open;
              setOpenIndex(nextOpen ? i : null);
            }}>
              <summary className={s.q}>
                <span className={s.num}>{i + 1}</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onQInput(i)}
                  className={s.qText}
                >
                  {qa.q}
                </span>
              </summary>
              <div
                className={s.a}
                contentEditable
                suppressContentEditableWarning
                onInput={onAInput(i)}
              >
                {qa.a}
              </div>
            </details>
          </div>
        );
      })}
    </div>
  );
}
