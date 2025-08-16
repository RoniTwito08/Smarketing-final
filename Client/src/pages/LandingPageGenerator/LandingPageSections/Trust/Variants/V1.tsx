// src/components/LandingPageSections/Trust/Variants/V1.tsx
"use client";
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
  if (/(מהיר|זריז|Performance|ביצועים)/.test(l)) return FaBolt;
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
  return (
    <>
      <div className={`${s.grid} ${colsCls(options.columns)} ${densCls(options.density)} ${options.equalHeights ? s.equalHeights : ""}`}>
        {stats.map((st, i) => {
          const Icon = options.showIcons ? pickIcon(st.label) : null;
          return (
            <article key={i} className={`${s.card} ${s["shape-"+options.shape]} ${s["accent-"+options.accent]}`}>
              <div className={s.row}>
                {Icon && <div className={s.icon}><Icon/></div>}
                <div className={s.value}>{st.value}</div>
              </div>
              <div className={s.label}>{st.label}</div>
            </article>
          );
        })}
      </div>

      {options.showBadges && badges?.length > 0 && (
        <div className={s.badgesRow}>
          {badges.slice(0, 8).map((b, i) => (
            <span key={i} className={`${s.badge} ${s["accent-"+options.accent]}`}>{b}</span>
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
