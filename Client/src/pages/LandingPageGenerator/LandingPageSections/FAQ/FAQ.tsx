// src/components/LandingPageSections/FAQ/FAQ.tsx
"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./faq.module.css";
import FAQPopup, { FAQOptions } from "./FAQPopup";

import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";

export type QA = { q: string; a: string };

export interface FAQProps {
  title?: string;
  subtitle?: string;
  items?: QA[];
  onDelete?: () => void;
  showHeader?: boolean;
}

const VARIANTS = [V1, V2, V3] as const;

const DEFAULT_ITEMS: QA[] = [
  { q: "איך מזמינים שירות?", a: "משאירים פרטים בטופס או שולחים וואטסאפ, ונחזור מיד." },
  { q: "מה זמני הפעילות?", a: "א'-ה' 08:00–18:00, ובמקרי חירום גם בשישי." },
  { q: "מה זמן התגובה?", a: "בדרך כלל עד שעה, לעיתים אף פחות." },
  { q: "איך נקבע המחיר?", a: "לפי היקף העבודה והחומרים. תקבלו הצעת מחיר שקופה." },
  { q: "יש אחריות?", a: "כן, אחריות מלאה בהתאם לסוג השירות." },
  { q: "איך משלמים?", a: "אשראי/העברה/מזומן. אפשרויות גמישות לפי הצורך." },
];

export default function FAQ({
  title = "שאלות נפוצות",
  subtitle,
  items,
  onDelete,
  showHeader = true,
}: FAQProps) {
  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<FAQOptions>({
    template: 0,                 // 0..2
    columns: "auto",             // auto | single | double
    density: "normal",           // compact | normal | spacious
    expandMode: "details",       // details | accordion
    showNumbers: false,
    equalHeights: false,
  });

  const safeItems = useMemo<QA[]>(() => {
    const arr = Array.isArray(items) ? items : [];
    const cleaned = arr
      .map((x) => ({ q: String(x?.q ?? "").trim(), a: String(x?.a ?? "").trim() }))
      .filter((x) => x.q && x.a);
    return (cleaned.length ? cleaned : DEFAULT_ITEMS).slice(0, 12);
  }, [items]);

  const ActiveVariant = VARIANTS[Math.min(VARIANTS.length - 1, Math.max(0, opts.template))] as any;

  return (
    <section
      className={s.faqSection}
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

      {showHeader && (title || subtitle) && (
        <header className={s.header}>
          {title && <h2 className={s.heading}>{title}</h2>}
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </header>
      )}

      <ActiveVariant items={safeItems} options={opts} />

      <FAQPopup
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
