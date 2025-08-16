"use client";
import React, { useState } from "react";
import s from "../trust.module.css";
import type { Stat } from "../Trust";
import { FaCheckCircle } from "react-icons/fa";

export default function V4({
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
    showIcons: boolean;
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
  const onBadge = (i:number) => (e:React.FormEvent<HTMLLIElement>)=>{
    const v=(e.currentTarget as HTMLLIElement).innerText.replace(/^\s*✓?\s*/,'');
    setLocalBadges(p=>{const n=[...p]; n[i]=v; return n;});
  };

  return (
    <div className={s.v4Wrap}>
      <div className={`${s.grid} ${colsCls(options.columns)} ${densCls(options.density)} ${options.equalHeights ? s.equalHeights : ""}`}>
        {localStats.map((st, i) => (
          <article key={i} className={`${s.card} ${s.striped} ${s["shape-"+options.shape]}`}>
            <div
              className={s.value}
              contentEditable
              suppressContentEditableWarning
              onInput={onVal(i)}
            >
              {st.value}
            </div>
            <div
              className={s.label}
              contentEditable
              suppressContentEditableWarning
              onInput={onLabel(i)}
            >
              {st.label}
            </div>
          </article>
        ))}
      </div>

      {options.showBadges && localBadges.length > 0 && (
        <ul className={s.checkList}>
          {localBadges.slice(0, 8).map((b, i) => (
            <li
              key={i}
              contentEditable
              suppressContentEditableWarning
              onInput={onBadge(i)}
            >
              <FaCheckCircle/> {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function colsCls(c: "auto"|"single"|"double"|"triple"|"quad"){
  switch(c){
    case "single": return (s as any)["columns-1"];
    case "double": return (s as any)["columns-2"];
    case "triple": return (s as any)["columns-3"];
    case "quad":   return (s as any)["columns-4"];
    default:       return (s as any)["columns-auto"];
  }
}
function densCls(d: "compact"|"normal"|"spacious"){
  return d === "compact" ? s.compact : d === "spacious" ? s.spacious : s.normal;
}
