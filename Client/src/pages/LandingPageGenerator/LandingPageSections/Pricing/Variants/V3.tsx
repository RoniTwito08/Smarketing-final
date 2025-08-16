"use client";
import React, { useState } from "react";
import s from "../pricing.module.css";
import type { PricingPlan } from "../Pricing";
import { FaCheck } from "react-icons/fa";

export default function V3({
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
  const [localPlans, setLocalPlans] = useState<PricingPlan[]>(plans);
  const [displayCurrency, setDisplayCurrency] = useState(options.currency);
  const [ribbonText, setRibbonText] = useState("Best Value");

  const onPlanName = (i:number)=>(e:React.FormEvent<HTMLHeadingElement>)=>{
    const v=(e.currentTarget as HTMLHeadingElement).innerText;
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
  const onFeat = (i:number,k:number)=>(e:React.FormEvent<HTMLSpanElement>)=>{
    const v=(e.currentTarget as HTMLSpanElement).innerText;
    setLocalPlans(p=>{
      const n=[...p]; const feats=[...(n[i].features||[])];
      feats[k]=v; n[i]={...n[i], features:feats}; return n;
    });
  };
  const onCta = (i:number, which:'primary'|'ghost') => (e:React.FormEvent<HTMLAnchorElement>)=>{
    const v=(e.currentTarget as HTMLAnchorElement).innerText;
    setLocalPlans(p=>{
      const n=[...p];
      if(which==='primary') n[i]={...n[i], ctaLabel:v};
      else n[i]={...n[i], secondaryCtaLabel:v as any};
      return n;
    });
  };

  return (
    <div className={`${s.grid} ${densityCls(options.density)} ${columnsCls(options.columns)} ${options.equalHeights ? s.equalHeights : ""}`}>
      {localPlans.map((p, i) => (
        <article key={i} className={`${s.card} ${s.glass} ${p.highlight ? s.highlight : ""}`}>
          {p.highlight && (
            <div
              className={s.ribbon}
              contentEditable
              suppressContentEditableWarning
              onInput={(e)=>setRibbonText((e.currentTarget as HTMLDivElement).innerText)}
            >
              {ribbonText}
            </div>
          )}

          <header className={s.cardHeader}>
            <h3
              className={s.planName}
              contentEditable
              suppressContentEditableWarning
              onInput={onPlanName(i)}
            >
              {p.name}
            </h3>

            {options.showBadges && (p.badge ?? "") !== undefined && (
              <span
                className={s.badge}
                contentEditable
                suppressContentEditableWarning
                onInput={onBadge(i)}
              >
                {p.badge}
              </span>
            )}

            <div className={s.priceRow}>
              <span
                className={s.currency}
                contentEditable
                suppressContentEditableWarning
                onInput={onCurrency}
              >
                {displayCurrency}
              </span>
              <span
                className={s.price}
                contentEditable
                suppressContentEditableWarning
                onInput={onPrice(i)}
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
          </header>

          <ul className={s.feats}>
            {(p.features || []).map((f, idx) => (
              <li key={idx} className={s.featItem}>
                <FaCheck />{" "}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onFeat(i, idx)}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>

          <div className={s.cta}>
            <a
              className={`${s.btn} ${s.btnPrimary}`}
              href={p.ctaHref || "#"}
              contentEditable
              suppressContentEditableWarning
              onInput={onCta(i,'primary')}
            >
              {p.ctaLabel || "התחל"}
            </a>
            <a
              className={`${s.btn} ${s.btnGhost}`}
              href={p.ctaHref || "#"}
              contentEditable
              suppressContentEditableWarning
              onInput={onCta(i,'ghost')}
            >
              {"עוד"}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

function columnsCls(cols:"auto"|"single"|"double"|"triple"){
  switch(cols){
    case "single": return (s as any)["columns-1"];
    case "double": return (s as any)["columns-2"];
    case "triple": return (s as any)["columns-3"];
    default:       return (s as any)["columns-auto"];
  }
}
function densityCls(d:"compact"|"normal"|"spacious"){
  return d === "compact" ? s.compact : d === "spacious" ? s.spacious : s.normal;
}
