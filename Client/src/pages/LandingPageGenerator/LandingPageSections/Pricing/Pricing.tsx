// src/components/LandingPageSections/Pricing/Pricing.tsx
"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./pricing.module.css";
import PricingPopup, { PricingOptions } from "./PricingPopUp";
import t from "../Services/Services.module.css"
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";
import V4 from "./Variants/V4";

/** --- טיפוסים שיכולים להגיע מה-AI --- */
export type Plan = {
  name: string;
  priceMonthly: number;
  features: string[];
  cta: string;
  highlight?: boolean;
};

/** --- הטיפוס הפנימי של קומפוננטת ה-Pricing --- */
export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  oldPrice?: string;
  badge?: string;
  highlight?: boolean;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
};

/** ממפה Plan ➜ PricingPlan */
function toPricingPlan(p: Plan): PricingPlan {
  return {
    name: p.name,
    price: p.priceMonthly.toString(),
    period: "לחודש",
    features: p.features ?? [],
    highlight: !!p.highlight,
    ctaLabel: p.cta,
    ctaHref: "#",
  };
}

/** מקבל גם PricingPlan וגם Plan ומנרמל ל-PricingPlan */
const asPricingPlan = (p: PricingPlan | Plan): PricingPlan =>
  "priceMonthly" in p ? toPricingPlan(p as Plan) : (p as PricingPlan);

export interface PricingProps {
  title?: string;
  subtitle?: string;
  plans?: (PricingPlan | Plan)[]; // מקבל שני הטיפוסים
  disclaimer?: string;
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3, V4];

export default function Pricing({
  title = "חבילות ושירותים",
  subtitle,
  plans,
  disclaimer,
  onDelete,
}: PricingProps) {
  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<PricingOptions>({
    template: 0,               // 0..3
    columns: "auto",           // auto | single | double | triple
    density: "normal",         // compact | normal | spacious
    currency: "₪",
    showPeriodSuffix: true,
    showOldPrice: true,
    showBadges: true,
    equalHeights: true,
    showDisclaimer: true,
    autoHighlightMiddle: true, // ידגיש אוטומטית את האמצעית אם אין highlight
  });

  // נרמול plans לטיפוס הפנימי
  const basePlans = useMemo(() => (plans ?? []).map(asPricingPlan), [plans]);

  // היגיון הדגשת חבילה
  const normalizedPlans = useMemo(() => {
    if (!basePlans.length) return [];
    const anyHighlight = basePlans.some((p) => p.highlight);
    if (anyHighlight || !opts.autoHighlightMiddle) return basePlans;
    const mid = Math.floor(basePlans.length / 2);
    return basePlans.map((p, i) => ({ ...p, highlight: i === mid ? true : p.highlight }));
  }, [basePlans, opts.autoHighlightMiddle]);

  const ActiveVariant =
    VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))] as any;

  return (
    <section
      className={s.pricingSection}
      dir="rtl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className={t.toolbar}>
          <button
            ref={editBtnRef}
            className={t.iconBtn}
            title="ערוך"
            onClick={() => setOpenPop(true)}
          >
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button
              className={`${t.iconBtn} ${t.trashBtn}`}
              title="מחק"
              onClick={onDelete}
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      <header className={s.header}>
        {title && <h2 className={s.heading}>{title}</h2>}
        {subtitle && <p className={s.subtitle}>{subtitle}</p>}
      </header>

      <ActiveVariant plans={normalizedPlans} options={opts} />

      {opts.showDisclaimer && disclaimer && (
        <p className={s.disclaimer}>{disclaimer}</p>
      )}

      <PricingPopup
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
