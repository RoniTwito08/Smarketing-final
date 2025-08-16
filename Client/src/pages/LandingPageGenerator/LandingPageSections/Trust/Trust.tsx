// src/components/LandingPageSections/Trust/Trust.tsx
"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./trust.module.css";
import TrustPopup, { TrustOptions } from "./TrustPopup";

import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";
import V4 from "./Variants/V4";

export type Stat = { label: string; value: string };

export interface TrustProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  badges?: string[];
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3, V4] as const;

const DEFAULT_STATS: Stat[] = [
  { label: "לקוחות מרוצים", value: "250+" },
  { label: "פרויקטים שבוצעו", value: "180+" },
  { label: "שנות ניסיון", value: "5" },
  { label: "זמן תגובה ממוצע", value: "שעה" },
];

const DEFAULT_BADGES = ["אחריות מלאה", "צוות מקצועי", "הוגנות ושקיפות", "שירות מהיר"];

export default function Trust({
  title = "למה לבחור בנו",
  subtitle,
  stats,
  badges,
  onDelete,
}: TrustProps) {
  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<TrustOptions>({
    template: 0,                // 0..3
    columns: "auto",            // auto | single | double | triple | quad
    density: "normal",          // compact | normal | spacious
    showBadges: true,
    showIcons: true,
    equalHeights: true,
    shape: "rounded",           // rounded | pill | square
    accent: "tertiary",         // primary | secondary | tertiary
  });

  // נרמול/דיפולטים/ניקוי נתונים
  const safeStats: Stat[] = useMemo(() => {
    const arr = Array.isArray(stats) ? stats : [];
    const cleaned = arr
      .map((x) => ({
        label: String(x?.label ?? "").trim(),
        value: String(x?.value ?? "").trim(),
      }))
      .filter((x) => x.label && x.value);
    return cleaned.length ? cleaned.slice(0, 8) : DEFAULT_STATS;
  }, [stats]);

  const safeBadges: string[] = useMemo(() => {
    const arr = Array.isArray(badges) ? badges : [];
    const cleaned = arr
      .map((b) => String(b ?? "").replace(/[^\p{L}\p{N}\s\-+%]/gu, "").trim())
      .filter(Boolean);
    return cleaned.length ? cleaned.slice(0, 8) : DEFAULT_BADGES;
  }, [badges]);

  const ActiveVariant =
    VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))] as any;

  return (
    <section
      className={s.trustSection}
      dir="rtl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className={s.toolbar}>
          <button
            ref={editBtnRef}
            className={s.iconBtn}
            title="ערוך"
            onClick={() => setOpenPop(true)}
            type="button"
          >
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button
              className={`${s.iconBtn} ${s.trashBtn}`}
              title="מחק"
              onClick={onDelete}
              type="button"
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {(title || subtitle) && (
        <header className={s.header}>
          {title && <h2 className={s.heading}>{title}</h2>}
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </header>
      )}

      <ActiveVariant
        stats={safeStats}
        badges={safeBadges}
        options={opts}
      />

      <TrustPopup
        open={openPop}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenPop(false)}
        anchorRef={editBtnRef}
        dir="rtl"
      />
    </section>
  );
}
