// src/components/LandingPageSections/Trust/Variants/V3.tsx
"use client";
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
    showIcons: boolean;      // לא בשימוש כאן – סגנון טקסטואלי
    equalHeights: boolean;
    shape: "rounded" | "pill" | "square";
    accent: "primary" | "secondary" | "tertiary";
  };
}) {
  return (
    <>
      <div className={`${s.inlineRow} ${densCls(options.density)} ${s["accent-"+options.accent]}`}>
        {stats.map((st, i) => (
          <div key={i} className={s.inlineItem}>
            <div className={s.value}>{st.value}</div>
            <div className={s.sep} aria-hidden>•</div>
            <div className={s.label}>{st.label}</div>
          </div>
        ))}
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

function densCls(d: "compact"|"normal"|"spacious"){
  return d === "compact" ? " "+(s as any).compact : d === "spacious" ? " "+(s as any).spacious : " "+(s as any).normal;
}
