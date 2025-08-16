// src/components/LandingPageSections/CTA/Variants/V2.tsx
"use client";
import s from "../cta.module.css";

export default function V2({
  items,
  options,
  Icon,
  onRemove,
  onRename,
}: {
  items: string[];
  options: {
    size: "sm"|"md"|"lg";
    style: "solid"|"outline"|"ghost";
    color: "primary"|"neutral"|"accent";
    align: "start"|"center"|"end"|"justify";
    rounded: "pill"|"md"|"none";
    gap: "tight"|"normal"|"loose";
    fullWidthOnMobile: boolean;
  };
  Icon?: React.ComponentType<{ size?: number }>;
  onRemove: (i:number) => void;
  onRename: (i:number, txt:string) => void;
}) {
  // גריד "צ'יפים" עם צל קל
  return (
    <div className={`${s.grid} ${gapCls(options.gap)} ${options.fullWidthOnMobile ? s.stackMobile : ""}`}>
      {items.map((txt, i) => (
        <div key={i} className={s.chipWrap}>
          <a href="#" className={`${s.chip} ${sizeCls(options.size)} ${chipStyleCls(options.style, options.color)} ${roundedCls(options.rounded)}`} onClick={e => e.preventDefault()}>
            <span
              className={s.btnLabel}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onRename(i, e.currentTarget.innerText)}
            >
              {txt}
            </span>
            {Icon && <Icon size={12} />}
          </a>
          <button className={s.closeBtn} title="הסר" onClick={() => onRemove(i)} type="button">×</button>
        </div>
      ))}
    </div>
  );
}

function sizeCls(sz:"sm"|"md"|"lg"){ return sz==="sm"? (s as any).sizeSm : sz==="lg"? (s as any).sizeLg : (s as any).sizeMd; }
function roundedCls(r:"pill"|"md"|"none"){ return r==="pill"? (s as any).roundPill : r==="md"? (s as any).roundMd : (s as any).roundNone; }
function gapCls(g:"tight"|"normal"|"loose"){ return g==="tight"? (s as any).gapTight : g==="loose"? (s as any).gapLoose : (s as any).gapNormal; }
function chipStyleCls(style:"solid"|"outline"|"ghost", color:"primary"|"neutral"|"accent"){
  const map: Record<string,string> = {
    "solid:primary": (s as any).chipSolidPrimary,
    "solid:neutral": (s as any).chipSolidNeutral,
    "solid:accent":  (s as any).chipSolidAccent,
    "outline:primary": (s as any).chipOutlinePrimary,
    "outline:neutral": (s as any).chipOutlineNeutral,
    "outline:accent":  (s as any).chipOutlineAccent,
    "ghost:primary": (s as any).chipGhostPrimary,
    "ghost:neutral": (s as any).chipGhostNeutral,
    "ghost:accent":  (s as any).chipGhostAccent,
  };
  return map[`${style}:${color}`];
}
