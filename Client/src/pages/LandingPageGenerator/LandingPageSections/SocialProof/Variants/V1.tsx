"use client";
import  { useState, useMemo } from "react";
import s from "../socialProof.module.css";

type Options = {
  columns: "auto" | "double" | "triple";
  density: "compact" | "normal" | "spacious";
  rounded: boolean;
  softBackground: boolean;
};

export default function V1({
  brands,
  options,
}: {
  brands: string[];
  options: Options;
}) {
  const [local, setLocal] = useState<string[]>(brands);

  const onBrandChange = (i: number) => (next: string) => {
    setLocal(prev => {
      const n = [...prev];
      n[i] = next;
      return n;
    });
  };

  return (
    <div className={`${s.grid} ${colsCls(options.columns)} ${densityCls(options.density)} ${options.rounded ? s.rounded : ""} ${options.softBackground ? s.soft : ""}`}>
      {local.map((b, i) => (
        <BrandPill key={i} textOrUrl={b} onEdit={onBrandChange(i)} />
      ))}
    </div>
  );
}

function BrandPill({ textOrUrl, onEdit }: { textOrUrl: string; onEdit: (v: string) => void }) {
  const isImg = useMemo(
    () => /\.(png|jpe?g|webp|svg)$/i.test(textOrUrl) || (/^https?:\/\//i.test(textOrUrl) && !/\s/.test(textOrUrl)),
    [textOrUrl]
  );

  return (
    <div className={s.pill}>
      {isImg ? (
        <div className={s.pillInner}>
          <img src={textOrUrl} alt="" loading="lazy" />
          <span
            className={s.editableUrl}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onEdit((e.currentTarget as HTMLSpanElement).innerText)}
          >
            {textOrUrl}
          </span>
        </div>
      ) : (
        <span
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onEdit((e.currentTarget as HTMLSpanElement).innerText)}
        >
          {textOrUrl}
        </span>
      )}
    </div>
  );
}

function colsCls(c:"auto"|"double"|"triple"){ return c==="double"? (s as any)["columns-2"] : c==="triple"? (s as any)["columns-3"] : (s as any)["columns-auto"]; }
function densityCls(d:"compact"|"normal"|"spacious"){ return d==="compact"? (s as any).compact : d==="spacious"? (s as any).spacious : (s as any).normal; }
