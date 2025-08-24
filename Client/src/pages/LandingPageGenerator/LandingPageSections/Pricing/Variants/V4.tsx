"use client";
import React, { useMemo, useState } from "react";
import s from "../Pricing.module.css";
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
  const [localPlans, setLocalPlans] = useState<PricingPlan[]>(plans);
  const [displayCurrency, setDisplayCurrency] = useState(options.currency);

  const allFeatures = useMemo(
    () => Array.from(new Set(localPlans.flatMap(p => p.features || []))),
    [localPlans]
  );

  const onPlanName = (i:number)=>(e:React.FormEvent<HTMLDivElement>)=>{
    const v=(e.currentTarget as HTMLDivElement).innerText;
    setLocalPlans(p=>{const n=[...p]; n[i]={...n[i], name:v}; return n;});
  };
  const onBadge = (i:number)=>(e:React.FormEvent<HTMLSpanElement>)=>{
    const v=(e.currentTarget as HTMLSpanElement).innerText;
    setLocalPlans(p=>{const n=[...p]; n[i]={...n[i], badge:v}; return n;});
  };
  const onCurrency = (e:React.FormEvent<HTMLSpanElement>)=>{
    setDisplayCurrency((e.currentTarget as HTMLSpanElement).innerText);
  };
  const onPrice = (i:number)=>(e:React.FormEvent<HTMLSpanElement>)=>{
    const v=(e.currentTarget as HTMLSpanElement).innerText;
    setLocalPlans(p=>{const n=[...p]; n[i]={...n[i], price:v}; return n;});
  };
  const onPeriod = (i:number)=>(e:React.FormEvent<HTMLSpanElement>)=>{
    const v=(e.currentTarget as HTMLSpanElement).innerText.replace(/^\//,'');
    setLocalPlans(p=>{const n=[...p]; n[i]={...n[i], period:v}; return n;});
  };
  const onOldPrice = (i:number)=>(e:React.FormEvent<HTMLSpanElement>)=>{
    const v=(e.currentTarget as HTMLSpanElement).innerText.replace(displayCurrency,'');
    setLocalPlans(p=>{const n=[...p]; n[i]={...n[i], oldPrice:v}; return n;});
  };
  const onFeatHeader = (r:number)=>(e:React.FormEvent<HTMLTableCellElement>)=>{
    const v=(e.currentTarget as HTMLTableCellElement).innerText;
    // עדכון שם התכונה בשורות כל התכניות
    setLocalPlans(p=>{
      const n=[...p].map(plan=>{
        const feats=[...(plan.features||[])];
        const idx = feats.findIndex(f=>f===allFeatures[r]);
        if(idx>=0) feats[idx]=v;
        return {...plan, features:feats};
      });
      return n;
    });
  };
  const onCta = (i:number)=>(e:React.FormEvent<HTMLAnchorElement>)=>{
    const v=(e.currentTarget as HTMLAnchorElement).innerText;
    setLocalPlans(p=>{const n=[...p]; n[i]={...n[i], ctaLabel:v}; return n;});
  };

  return (
    <div className={s.tableWrap}>
      <table className={s.table} dir="rtl">
        <thead className={s.thead}>
          <tr>
            <th>תכונה</th>
            {localPlans.map((p, i) => (
              <th key={i}>
                <div style={{ display:"grid", gap:6 }}>
                  <strong
                    contentEditable
                    suppressContentEditableWarning
                    onInput={onPlanName(i)}
                  >
                    {p.name}
                  </strong>
                  {options.showBadges && (p.badge ?? "") !== undefined && (
                    <span
                      className={s.tableBadge}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={onBadge(i)}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={s.tbody}>
          <tr>
            <td><strong>מחיר</strong></td>
            {localPlans.map((p, i) => (
              <td key={i}>
                <div style={{ display:"flex", alignItems:"baseline", gap:6, justifyContent:"center" }}>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={onCurrency}
                  >
                    {displayCurrency}
                  </span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={onPrice(i)}
                    style={{ fontWeight: 700 }}
                  >
                    {p.price}
                  </span>
                  {options.showPeriodSuffix && (
                    <span
                      className={s.period}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={onPeriod(i)}
                    >
                      {p.period ? `/${p.period}` : ""}
                    </span>
                  )}
                  {options.showOldPrice && (
                    <span
                      className={s.oldPrice}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={onOldPrice(i)}
                    >
                      {p.oldPrice ? `${displayCurrency}${p.oldPrice}` : ""}
                    </span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {allFeatures.map((f, r) => (
            <tr key={r}>
              <td
                style={{ textAlign:"start" }}
                contentEditable
                suppressContentEditableWarning
                onInput={onFeatHeader(r)}
              >
                {f}
              </td>
              {localPlans.map((p, c) => (
                <td key={c}>
                  {/* כאן נשאיר טקסט חופשי לעריכה אם תרצה,
                      אבל כברירת מחדל מציגים ✓ / — לפי הכללה */}
                  {p.features?.includes(f) ? "✓" : "—"}
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td />
            {localPlans.map((p, i) => (
              <td key={i}>
                <a
                  className={`${s.btn} ${s.btnPrimary}`}
                  href={p.ctaHref || "#"}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onCta(i)}
                >
                  {p.ctaLabel || "בחר"}
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
