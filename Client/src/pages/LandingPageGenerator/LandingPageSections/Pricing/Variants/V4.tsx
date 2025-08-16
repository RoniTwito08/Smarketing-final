// src/components/LandingPageSections/Pricing/Variants/V4.tsx
"use client";
import s from "../pricing.module.css";
import type { PricingPlan } from "../Pricing";

export default function V4({
  plans,
  options,
}: {
  plans: PricingPlan[];
  options: {
    currency: string;
    showPeriodSuffix: boolean;
    showOldPrice: boolean;
    showBadges: boolean;
  };
}) {
  const allFeatures = Array.from(new Set(plans.flatMap(p => p.features || [])));

  return (
    <div className={s.tableWrap}>
      <table className={s.table} dir="rtl">
        <thead className={s.thead}>
          <tr>
            <th>תכונה</th>
            {plans.map((p, i) => (
              <th key={i}>
                <div style={{ display:"grid", gap:6 }}>
                  <strong>{p.name}</strong>
                  {options.showBadges && p.badge && <span className={s.tableBadge}>{p.badge}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={s.tbody}>
          <tr>
            <td><strong>מחיר</strong></td>
            {plans.map((p, i) => (
              <td key={i}>
                <div style={{ display:"flex", alignItems:"baseline", gap:6, justifyContent:"center" }}>
                  <span><strong>{options.currency}{p.price}</strong></span>
                  {options.showPeriodSuffix && p.period && <span className={s.period}>/{p.period}</span>}
                  {options.showOldPrice && p.oldPrice && <span className={s.oldPrice}>{options.currency}{p.oldPrice}</span>}
                </div>
              </td>
            ))}
          </tr>

          {allFeatures.map((f, r) => (
            <tr key={r}>
              <td style={{ textAlign:"start" }}>{f}</td>
              {plans.map((p, c) => (
                <td key={c}>{p.features?.includes(f) ? "✓" : "—"}</td>
              ))}
            </tr>
          ))}

          <tr>
            <td />
            {plans.map((p, i) => (
              <td key={i}>
                <a className={`${s.btn} ${s.btnPrimary}`} href={p.ctaHref || "#"}>{p.ctaLabel || "בחר"}</a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
