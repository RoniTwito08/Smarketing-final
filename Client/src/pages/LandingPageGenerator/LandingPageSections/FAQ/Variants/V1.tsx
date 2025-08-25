// src/components/LandingPageSections/FAQ/Variants/V3.tsx
"use client";
import { useState } from "react";
import s from "../faq.module.css";
import type { QA } from "../FAQ";

export default function V3({
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
  const densCls = options.density === "compact" ? s.compact : options.density === "spacious" ? s.spacious : s.normal;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [local, setLocal] = useState<QA[]>(items);

  const onQInput = (i:number) => (e:React.FormEvent<HTMLHeadingElement>)=>{
    const v=(e.currentTarget as HTMLHeadingElement).innerText;
    setLocal(prev=>{const n=[...prev]; n[i]={...n[i], q:v}; return n;});
  };
  const onAInput = (i:number) => (e:React.FormEvent<HTMLParagraphElement>)=>{
    const v=(e.currentTarget as HTMLParagraphElement).innerText;
    setLocal(prev=>{const n=[...prev]; n[i]={...n[i], a:v}; return n;});
  };

  return (
    <ul className={`${s.list} ${densCls}`}>
      {local.map((qa, i) => {
        const active = openIndex === i;
        return (
          <li key={i} className={`${s.li} ${active ? s.open : ""}`}>
            <button
              className={s.accHead}
              type="button"
              onClick={() => setOpenIndex(active ? null : i)}
              aria-expanded={active}
              aria-controls={`v3-panel-${i}`}
            >
              {options.showNumbers && <span className={s.num}>{i + 1}</span>}
              <h3
                className={s.liQ}
                contentEditable
                suppressContentEditableWarning
                onInput={onQInput(i)}
              >
                {qa.q}
              </h3>
            </button>
            <div
              id={`v3-panel-${i}`}
              className={`${s.accPanel} ${active ? s.open : ""}`}
              aria-hidden={!active}
            >
              <p
                className={s.liA}
                contentEditable
                suppressContentEditableWarning
                onInput={onAInput(i)}
              >
                {qa.a}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

