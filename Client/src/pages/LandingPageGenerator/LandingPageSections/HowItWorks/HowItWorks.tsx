// src/components/LandingPageSections/HowItWorks/HowItWorks.tsx
"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./howItWorks.module.css";
import HowItWorksPopup, { HowItWorksOptions } from "./HowItWorksPopup";
import t from "../Services/Services.module.css"
// Variants
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V4 from "./Variants/V4";

export type StepIcon =
  | "search" | "calendar" | "phone" | "form" | "tools"
  | "truck" | "credit" | "check" | "user" | "shield" | "bolt" | "spark";

export interface StepItem {
  step: number;
  title: string;
  text: string;
  icon?: StepIcon;
}

export interface HowItWorksProps {
  steps?: StepItem[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  onDelete?: () => void;
}

const VARIANTS = [V1, V2,V4];

export default function HowItWorks({
  steps,
  title = "איך זה עובד",
  subtitle,
  showHeader = true,
  onDelete,
}: HowItWorksProps) {
  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<HowItWorksOptions>({
    template: 0,        // 0..3
    columns: "auto",    // auto | single | double | triple
    showNumbers: true,
    showConnectors: true,
    density: "normal",  // compact | normal | spacious
  });

  const ActiveVariant =
    VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))] as any;

  const sorted = useMemo(
    () =>
      [...(steps || [])]
        .filter(Boolean)
        .sort((a, b) => (a?.step ?? 0) - (b?.step ?? 0)),
    [steps]
  );

  return (
    <section
      className={s.hiwSection}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      dir="rtl"
    >
      {hovered && (
        <div className={t.toolbar}>
          <button
            ref={editBtnRef}
            className={t.iconBtn}
            onClick={() => setOpenPop(true)}
            title="ערוך"
          >
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button
              className={`${t.iconBtn} ${t.trashBtn}`}
              onClick={onDelete}
              title="מחק"
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {showHeader && (
        <header className={s.header}>
          <h2 className={s.heading}>{title}</h2>
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </header>
      )}

      <ActiveVariant
        steps={sorted}
        options={opts}
      />

      <HowItWorksPopup
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
