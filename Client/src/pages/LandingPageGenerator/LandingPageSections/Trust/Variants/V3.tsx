"use client";
import React, { useState } from "react";
import s from "../trust.module.css";
import type { Stat } from "../Trust";

export default function V3({
  stats,
  badges,
  options,
}: {
  stats: Stat[];
  badges: string[];
  options: {
    columns: "auto" | "single" | "double" | "triple" | "quad";
    density: "compact" | "normal" | "spacious";
    showBadges: boolean;
    showIcons: boolean; // לא בשימוש כאן – סגנון טקסטואלי
    equalHeights: boolean;
    shape: "rounded" | "pill" | "square";
    accent: "primary" | "secondary" | "tertiary";
  };
}) {
  const [localStats, setLocalStats] = useState<Stat[]>(stats);
  const [localBadges, setLocalBadges] = useState<string[]>(badges || []);

  const onVal = (i:number) => (e:React.FormEvent<HTMLDivElement>)=>{
    const v=(e.currentTarget as HTMLDivElement).innerText;
    setLocalStats(p=>{const n=[...p]; n[i]={...n[i], value:v}; return n;});
  };
  const onLabel = (i:number) => (e:React.FormEvent<HTMLDivElement>)=>{
    const v=(e.currentTarget as HTMLDivElement).innerText;
    setLocalStats(p=>{const n=[...p]; n[i]={...n[i], label:v}; return n;});
  };
  const onBadge = (i:number) => (e:React.FormEvent<HTMLSpanElement>)=>{
    const v=(e.currentTarget as HTMLSpanElement).innerText;
    setLocalBadges(p=>{const n=[...p]; n[i]=v; return n;});
  };

  return (
    <>
      <div className={`${s.inlineRow} ${densCls(options.density)} ${s["accent-"+options.accent]}`}>
        {localStats.map((st, i) => (
          <div key={i} className={s.inlineItem}>
            <div
              className={s.value}
              contentEditable
              suppressContentEditableWarning
              onInput={onVal(i)}
            >
              {st.value}
            </div>
            <div className={s.sep} aria-hidden>•</div>
            <div
              className={s.label}
              contentEditable
              suppressContentEditableWarning
              onInput={onLabel(i)}
            >
              {st.label}
            </div>
          </div>
        ))}
      </div>

      {options.showBadges && localBadges.length > 0 && (
        <div className={s.badgesRow}>
          {localBadges.slice(0, 8).map((b, i) => (
            <span
              key={i}
              className={`${s.badge} ${s["accent-"+options.accent]}`}
              contentEditable
              suppressContentEditableWarning
              onInput={onBadge(i)}
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function densCls(d: "compact"|"normal"|"spacious"){
  return d === "compact" ? " "+(s as any).compact : d === "spacious" ? " "+(s as any).spacious : " "+(s as any).normal;
}
