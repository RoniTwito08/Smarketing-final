"use client";
import { useMemo, useState } from "react";
import s from "../socialProof.module.css";

type Options = {
  density: "compact" | "normal" | "spacious";
  rounded: boolean;
  softBackground: boolean;
};

export default function V2({
  brands,
  options,
}: {
  brands: string[];
  options: Options;
}) {
  const [local, setLocal] = useState<string[]>(brands);

  // בונים שורת מרקיז שמבוססת על ה־local
  const line = useMemo(() => {
    const base = [...local, ...local, ...local];
    return base.slice(0, Math.max(12, local.length * 2));
  }, [local]);

  const editAt = (origIndex: number) => (next: string) => {
    setLocal(prev => {
      const n = [...prev];
      n[origIndex] = next;
      return n;
    });
  };

  return (
    <div className={`${s.marqueeWrap} ${options.softBackground ? s.soft : ""}`}>
      <div className={s.marquee} aria-hidden={false}>
        {line.map((b, i) => {
          // מחשבים את האינדקס במערך המקורי (לפני השכפולים)
          const origIndex = i % local.length;
          const isImg = /\.(png|jpe?g|webp|svg)$/i.test(b) || /^https?:\/\//i.test(b);
          return (
            <div key={i} className={`${s.pill} ${options.rounded ? s.rounded : ""}`}>
              {isImg ? (
                <div className={s.pillInner}>
                  <img src={b} alt="" />
                  <span
                    className={s.editableUrl}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => editAt(origIndex)((e.currentTarget as HTMLSpanElement).innerText)}
                  >
                    {b}
                  </span>
                </div>
              ) : (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => editAt(origIndex)((e.currentTarget as HTMLSpanElement).innerText)}
                >
                  {b}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
