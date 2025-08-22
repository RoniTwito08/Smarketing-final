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

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [local, setLocal] = useState<QA[]>(items);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    panelsRef.current.forEach((el, i) => {
      if (!el) return;
      const isOpen = openIndex === i;
      el.classList.toggle(s.open, isOpen);
      el.style.maxHeight = isOpen ? el.scrollHeight + "px" : "0px";
    });
  }, [openIndex]);

  const onQInput = (i:number) => (e:React.FormEvent<HTMLSpanElement>)=>{
    const v = (e.currentTarget as HTMLSpanElement).innerText;
    setLocal(prev => { const n=[...prev]; n[i]={...n[i], q:v}; return n; });
  };
  const onAInput = (i:number) => (e:React.FormEvent<HTMLParagraphElement>)=>{
    const v = (e.currentTarget as HTMLParagraphElement).innerText;
    setLocal(prev => { const n=[...prev]; n[i]={...n[i], a:v}; return n; });
  };

  return (
    <div className={`${s.grid} ${colsCls} ${densCls} ${options.equalHeights ? s.equalHeights : ""}`}>
      {local.map((qa, i) => {
        const active = openIndex === i;
        return (
          <div key={i} className={`${s.card} ${active ? s.open : ""}`}>
            <button
              className={`${s.accHead} ${active ? s.open : ""}`}
              type="button"
              onClick={() => setOpenIndex(active ? null : i)}
              aria-expanded={active}
              aria-controls={`faq-panel-${i}`}
            >
              {options.showNumbers && <span className={s.num}>{i + 1}</span>}
              <span
                contentEditable
                suppressContentEditableWarning
                onInput={onQInput(i)}
                className={s.qText}
              >
                {qa.q}
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              ref={(el) => { if (el) panelsRef.current[i] = el; }}
              className={s.accPanel}
              role="region"
              aria-hidden={!active}
            >
              <p
                className={s.a}
                contentEditable
                suppressContentEditableWarning
                onInput={onAInput(i)}
              >
                {qa.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
