// src/components/LandingPageSections/Pricing/Variants/V1.tsx
"use client";
import s from "../pricing.module.css";
import type { PricingPlan } from "../Pricing";
import { FaCheck } from "react-icons/fa";

export default function V1({
  plans,
  options,
}: {
  plans: PricingPlan[];
  options: {
    columns: "auto" | "single" | "double" | "triple";
    density: "compact" | "normal" | "spacious";
    currency: string;
    showPeriodSuffix: boolean;
    showOldPrice: boolean;
    showBadges: boolean;
    equalHeights: boolean;
  };
}) {
  return (
    <div className={`${s.grid} ${densityCls(options.density)} ${columnsCls(options.columns)} ${options.equalHeights ? s.equalHeights : ""}`}>
      {plans.map((p, i) => (
        <article key={i} className={`${s.card} ${p.highlight ? s.highlight : ""}`}>
          {p.highlight && <div className={s.ribbon}>מומלץ</div>}

          <header className={s.cardHeader}>
            <h3 className={s.planName}>{p.name}</h3>
            {options.showBadges && p.badge && <span className={s.badge}>{p.badge}</span>}
            <div className={s.priceRow}>
              <span className={s.currency}>{options.currency}</span>
              <span className={s.price}>{p.price}</span>
              {options.showPeriodSuffix && p.period && <span className={s.period}>/{p.period}</span>}
              {options.showOldPrice && p.oldPrice && <span className={s.oldPrice}>{options.currency}{p.oldPrice}</span>}
            </div>
          </header>

          <ul className={s.feats}>
            {p.features?.map((f, idx) => (
              <li key={idx} className={s.featItem}><FaCheck /> {f}</li>
            ))}
          </ul>

          <div className={s.cta}>
            <a className={`${s.btn} ${s.btnPrimary}`} href={p.ctaHref || "#"}>{p.ctaLabel || "בחר חבילה"}</a>
            <a className={`${s.btn} ${s.btnGhost}`} href={p.ctaHref || "#"}>פרטים</a>
          </div>
        </article>
      ))}
    </div>
  );
}

function columnsCls(cols: "auto"|"single"|"double"|"triple"){
  switch(cols){
    case "single": return (s as any)["columns-1"];
    case "double": return (s as any)["columns-2"];
    case "triple": return (s as any)["columns-3"];
    default:       return (s as any)["columns-auto"];
  }
}
function densityCls(d: "compact"|"normal"|"spacious"){
  return d === "compact" ? s.compact : d === "spacious" ? s.spacious : s.normal;
}
