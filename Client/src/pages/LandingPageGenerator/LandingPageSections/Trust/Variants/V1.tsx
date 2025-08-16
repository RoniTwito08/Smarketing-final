"use client";
import React, { useState } from "react";
import s from "../trust.module.css";
import type { Stat } from "../Trust";
import { FaClock, FaUsers, FaCheck, FaStar, FaAward, FaShieldAlt, FaBolt, FaThumbsUp } from "react-icons/fa";

const pickIcon = (label: string) => {
  const l = label.toLowerCase();
  if (/(זמן|תגובה|מהיר|שעה|דקות)/.test(l)) return FaClock;
  if (/(לקוח|לקוחות|משתמש)/.test(l)) return FaUsers;
  if (/(פרויקט|משימה|בוצע|הושלם)/.test(l)) return FaCheck;
  if (/(שנים|ניסיון|ותק)/.test(l)) return FaAward;
  if (/(אחוז|דירוג|כוכב|מרוצים)/.test(l)) return FaStar;
  if (/(אחריות|אמון|בטוח|בטיחות)/.test(l)) return FaShieldAlt;
  if (/(מהיר|זריז|performance|ביצועים)/i.test(l)) return FaBolt;
  return FaThumbsUp;
};

export default function V1({
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

  const onVal = (i: number) => (e: React.FormEvent<HTMLDivElement>) => {
    const v = (e.currentTarget as HTMLDivElement).innerText;
    setLocalStats(prev => { const n=[...prev]; n[i]={...n[i], value:v}; return n; });
  };
  const onLabel = (i: number) => (e: React.FormEvent<HTMLDivElement>) => {
    const v = (e.currentTarget as HTMLDivElement).innerText;
    setLocalStats(prev => { const n=[...prev]; n[i]={...n[i], label:v}; return n; });
  };
  const onBadge = (i: number) => (e: React.FormEvent<HTMLSpanElement>) => {
    const v = (e.currentTarget as HTMLSpanElement).innerText;
    setLocalBadges(prev => { const n=[...prev]; n[i]=v; return n; });
  };

  return (
    <>
      <div className={`${s.grid} ${colsCls(options.columns)} ${densCls(options.density)} ${options.equalHeights ? s.equalHeights : ""}`}>
        {localStats.map((st, i) => {
          const Icon = options.showIcons ? pickIcon(st.label) : null;
          return (
            <article key={i} className={`${s.card} ${s["shape-"+options.shape]} ${s["accent-"+options.accent]}`}>
              <div className={s.row}>
                {Icon && <div className={s.icon}><Icon/></div>}
                <div
                  className={s.value}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onVal(i)}
                >
                  {st.value}
                </div>
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
          );
        })}
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
