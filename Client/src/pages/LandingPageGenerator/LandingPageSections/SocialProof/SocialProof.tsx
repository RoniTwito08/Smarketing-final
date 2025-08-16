"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./socialProof.module.css";
import SocialProofPopup, { SocialProofOptions } from "./SocialProofPopup";

import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";

export interface SocialProofProps {
  title?: string;
  brands?: string[];      // יכול להיות מחרוזות של שמות או קישורי תמונה (png/jpg/svg/webp)
  onDelete?: () => void;
  showHeader?: boolean;
}

const VARIANTS = [V1, V2, V3] as const;

export default function SocialProof({
  title = "בין לקוחותינו",
  brands,
  onDelete,
  showHeader = true,
}: SocialProofProps) {
  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<SocialProofOptions>({
    template: 0,                 // 0..2
    columns: "auto",             // auto | double | triple (ל-V1/V3)
    density: "normal",           // compact | normal | spacious
    rounded: true,
    softBackground: true,
  });

  const cleanBrands = useMemo(() => {
    const arr = Array.isArray(brands) ? brands : [];
    return arr.map((t) => String(t || "").trim()).filter(Boolean).slice(0, 36);
  }, [brands]);

  const ActiveVariant = VARIANTS[Math.min(VARIANTS.length - 1, Math.max(0, opts.template))] as any;

  return (
    <section
      className={s.spSection}
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
      

      {showHeader && title && (
        <header className={s.header}>
          <h2 className={s.heading}>{title}</h2>
        </header>
      )}

      <ActiveVariant brands={cleanBrands} options={opts} />

      <SocialProofPopup
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
