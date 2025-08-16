// src/components/LandingPageSections/Trust/Variants/V4.tsx
"use client";
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
  return (
    <div className={s.v4Wrap}>
      <div className={`${s.grid} ${colsCls(options.columns)} ${densCls(options.density)} ${options.equalHeights ? s.equalHeights : ""}`}>
        {stats.map((st, i) => (
          <article key={i} className={`${s.card} ${s.striped} ${s["shape-"+options.shape]}`}>
            <div className={s.value}>{st.value}</div>
            <div className={s.label}>{st.label}</div>
          </article>
        ))}
      </div>

      {options.showBadges && badges?.length > 0 && (
        <ul className={s.checkList}>
          {badges.slice(0, 8).map((b, i) => (
            <li key={i}><FaCheckCircle/> {b}</li>
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
