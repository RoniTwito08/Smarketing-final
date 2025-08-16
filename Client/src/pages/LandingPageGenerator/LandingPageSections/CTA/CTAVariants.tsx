// src/components/LandingPageSections/CTA/CTAVariants.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash, FaPlus } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import s from "./cta.module.css";
import CTAPopup, { CTAOptions } from "./CTAPopup";

import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";

export interface CTAVariantsProps {
  title?: string;
  subtitle?: string;
  items?: string[];
  onDelete?: () => void;
  showHeader?: boolean;
}

const VARIANTS = [V1, V2, V3] as const;

export default function CTAVariants({
  title = "קריאות לפעולה",
  subtitle,
  items,
  onDelete,
  showHeader = true,
}: CTAVariantsProps) {
  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  // הגדרות עיצוב
  const [opts, setOpts] = useState<CTAOptions>({
    template: 0,                 // 0..2 (V1..V3)
    size: "md",                  // sm | md | lg
    style: "solid",              // solid | outline | ghost
    color: "primary",            // primary | neutral | accent
    align: "center",             // start | center | end | justify
    rounded: "pill",             // pill | md | none
    gap: "normal",               // tight | normal | loose
    showIcons: true,
    fullWidthOnMobile: true,
  });

  const normalized = useMemo(() => {
    const base = (Array.isArray(items) ? items : [])
      .map((t) => String(t || "").trim())
      .filter(Boolean);
    const fallback = ["דברו איתנו", "קבלו הצעה", "קבעו שיחה", "שלחו הודעה", "זמינים בוואטסאפ", "התחילו עכשיו"];
    return (base.length ? base : fallback).slice(0, 12);
  }, [items]);

  // ננהל לוקאלית (כמו ב־Reviews) כדי שתהיה הוספה/מחיקה/עריכה במקום
  const [localItems, setLocalItems] = useState<string[]>(normalized);
  useEffect(() => setLocalItems(normalized), [normalized]);

  const addCTA = () => setLocalItems((p) => (p.length >= 12 ? p : [...p, "CTA חדש"]));
  const removeCTA = (i: number) => setLocalItems((p) => p.filter((_, j) => j !== i));
  const renameCTA = (i: number, txt: string) =>
    setLocalItems((p) => {
      const copy = [...p];
      copy[i] = txt.trim() || copy[i];
      return copy;
    });

  const ActiveVariant = VARIANTS[Math.min(VARIANTS.length - 1, Math.max(0, opts.template))] as any;

  return (
    <section
      className={s.ctaSection}
      dir="rtl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className={s.toolbar}>
          {localItems.length < 12 && (
            <button
              className={s.iconBtn}
              title="הוסף CTA"
              onClick={addCTA}
              type="button"
            >
              <FaPlus size={14} />
            </button>
          )}
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

      {showHeader && (title || subtitle) && (
        <header className={s.header}>
          {title && <h2 className={s.heading}>{title}</h2>}
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </header>
      )}

      <ActiveVariant
        items={localItems}
        options={opts}
        onRemove={removeCTA}
        onRename={renameCTA}
        Icon={opts.showIcons ? FaArrowLeft : undefined}
      />

      <CTAPopup
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
