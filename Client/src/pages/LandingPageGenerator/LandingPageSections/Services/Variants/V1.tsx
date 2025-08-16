"use client";
import React, { useEffect, useState } from "react";
import type { ServiceItem } from "../Services";
import s from "../services.module.css";
import { FaCheckCircle } from "react-icons/fa";

// כיוון אוטומטי לפי תוכן
const calcDir = (t: string) =>
  /[\u0590-\u05FF\u0600-\u06FF]/.test(t) ? "rtl" : "ltr";

export default function V1({ items, showIcons = true }: { items: ServiceItem[]; showIcons?: boolean }) {
  const [local, setLocal] = useState<ServiceItem[]>(items);

  // אם מגיעים פריטים חדשים (למשל טעינה מרחוק) – נסנכרן פעם הבאה
  useEffect(() => {
    setLocal(items);
  }, [items]);

  const onTitleInput = (i: number) => (e: React.FormEvent<HTMLHeadingElement>) => {
    const el = e.currentTarget as HTMLHeadingElement;
    const v = el.innerText;
    el.dir = calcDir(v);
    setLocal(prev => { const next = [...prev]; next[i] = { ...next[i], title: v }; return next; });
  };

  const onDescInput = (i: number) => (e: React.FormEvent<HTMLParagraphElement>) => {
    const el = e.currentTarget as HTMLParagraphElement;
    const v = el.innerText;
    el.dir = calcDir(v);
    setLocal(prev => { const next = [...prev]; next[i] = { ...next[i], description: v }; return next; });
  };

  return (
    <div className={`${s.grid} ${s.v1Grid}`}>
      {local.map((it, i) => (
        <article key={i} className={`${s.card} ${s.cardNeon}`}>
          <div className={s.cardHead}>
            {showIcons && <FaCheckCircle className={s.cardIcon} />}
            <h3
              className={`${s.cardTitle} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir={calcDir(it.title)}
              onInput={onTitleInput(i)}
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
              spellCheck={false}
            >
              {it.title}
            </h3>
          </div>
          <p
            className={`${s.cardText} ${s.editableAuto}`}
            contentEditable
            suppressContentEditableWarning
            dir={calcDir(it.description)}
            onInput={onDescInput(i)}
            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            spellCheck={false}
          >
            {it.description}
          </p>
        </article>
      ))}
    </div>
  );
}
