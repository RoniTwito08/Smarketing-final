// src/components/LandingPageSections/CTA/Variants/V1.tsx
"use client";
import s from "../cta.module.css";

export default function V1({
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
  return (
    <div className={`${s.wrap} ${alignCls(options.align)} ${gapCls(options.gap)} ${options.fullWidthOnMobile ? s.stackMobile : ""}`}>
      {items.map((txt, i) => (
        <div key={i} className={s.btnWrap}>
          <a href="#" className={`${s.btn} ${sizeCls(options.size)} ${styleCls(options.style, options.color)} ${roundedCls(options.rounded)}`} onClick={e => e.preventDefault()}>
            <span
              className={s.btnLabel}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onRename(i, e.currentTarget.innerText)}
            >
              {txt}
            </span>
            {Icon && <Icon size={14} />}
          </a>
          <button className={s.closeBtn} title="הסר" onClick={() => onRemove(i)} type="button">×</button>
        </div>
      ))}
    </div>
  );
}

function alignCls(a:"start"|"center"|"end"|"justify"){ return a==="start"? (s as any).alignStart : a==="end"? (s as any).alignEnd : a==="justify"? (s as any).alignJustify : (s as any).alignCenter; }
function sizeCls(sz:"sm"|"md"|"lg"){ return sz==="sm"? (s as any).sizeSm : sz==="lg"? (s as any).sizeLg : (s as any).sizeMd; }
function roundedCls(r:"pill"|"md"|"none"){ return r==="pill"? (s as any).roundPill : r==="md"? (s as any).roundMd : (s as any).roundNone; }
function gapCls(g:"tight"|"normal"|"loose"){ return g==="tight"? (s as any).gapTight : g==="loose"? (s as any).gapLoose : (s as any).gapNormal; }
function styleCls(style:"solid"|"outline"|"ghost", color:"primary"|"neutral"|"accent"){
  const map: Record<string,string> = {
    "solid:primary": (s as any).solidPrimary,
    "solid:neutral": (s as any).solidNeutral,
    "solid:accent":  (s as any).solidAccent,
    "outline:primary": (s as any).outlinePrimary,
    "outline:neutral": (s as any).outlineNeutral,
    "outline:accent":  (s as any).outlineAccent,
    "ghost:primary": (s as any).ghostPrimary,
    "ghost:neutral": (s as any).ghostNeutral,
    "ghost:accent":  (s as any).ghostAccent,
  };
  return map[`${style}:${color}`];
}
