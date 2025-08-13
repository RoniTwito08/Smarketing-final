"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./services.module.css";
import ServicesPopup, { ServicesOptions } from "./ServicesPopup";

// Variants
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";
import V4 from "./Variants/V4";

export type ServiceItem = { title: string; description: string };

export interface ServicesSectionProps {
  title?: string;
  items?: ServiceItem[];            // יכול להגיע undefined—נטפל בזה
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3, V4];

export default function ServicesSection({ title = "השירותים שלנו", items, onDelete }: ServicesSectionProps) {
  const list = useMemo(() => Array.isArray(items) ? items : [], [items]);

  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  // ברירות מחדל: טמפלט 0
  const [opts, setOpts] = useState<ServicesOptions>({
    template: 0,            // 0..3
    cardWidth: "M",         // "M" | "L"
    textAlign: "right",     // "right" | "center" | "left"
    radius: 16,
    blur: 0,
    padding: "M",           // "S" | "M" | "L"
    showIcons: true,
  });

  const ActiveVariant = VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))];

  // CSS vars דינמיים
  const sectionVars: React.CSSProperties = {
    ["--services-radius" as any]: `${opts.radius}px`,
    ["--services-blur" as any]: `${opts.blur}px`,
    ["--services-text-align" as any]: opts.textAlign,
    ["--services-card-max" as any]: opts.cardWidth === "L" ? "420px" : "340px",
    ["--services-pad" as any]: opts.padding === "S" ? "14px" : opts.padding === "L" ? "26px" : "20px",
  };

  if (list.length === 0) return null; // אין נתונים? לא נרנדר סקשן

  return (
    <section
      className={s.servicesSection}
      style={sectionVars}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      dir="rtl"
    >
      {/* Toolbar */}
      {hovered && (
        <div className={s.toolbar}>
          <button
            ref={editBtnRef}
            className={s.iconBtn}
            onClick={() => setOpenPop(true)}
            title="התאמה"
            aria-haspopup="dialog"
            aria-expanded={openPop}
          >
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button className={`${s.iconBtn} ${s.trashBtn}`} onClick={onDelete} title="מחק סקשן">
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {title && <h2 className={s.heading}>{title}</h2>}

      {/* וריאנט פעיל */}
      <ActiveVariant items={list} showIcons={opts.showIcons} />

      {/* פופ־אפ התאמות */}
      <ServicesPopup
        open={openPop}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenPop(false)}
        onPickTemplate={(i) => setOpts(prev => ({ ...prev, template: i }))}
        activeTemplate={opts.template}
        anchorRef={editBtnRef}
        dir="rtl"
      />
    </section>
  );
}
