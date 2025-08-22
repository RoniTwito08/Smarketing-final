"use client";
import  {  useState } from "react";
import s from "../socialProof.module.css";

type Options = {
  columns: "auto" | "double" | "triple";
  density: "compact" | "normal" | "spacious";
  rounded: boolean;
  softBackground: boolean;
};

export default function V3({
  brands,
  options,
}: {
  brands: string[];
  options: Options;
}) {
  const [local, setLocal] = useState<string[]>(brands);

  const onEdit = (i:number) => (next:string) => {
    setLocal(prev => {
      const n = [...prev];
      n[i] = next;
      return n;
    });
  };

  return (
    <div className={`${s.grid} ${colsCls(options.columns)} ${densityCls(options.density)} ${options.softBackground ? s.soft : ""}`}>
      {local.map((b, i) => {
        const isImg = /\.(png|jpe?g|webp|svg)$/i.test(b) || /^https?:\/\//i.test(b);
        return (
          <div key={i} className={`${s.card} ${options.rounded ? s.rounded : ""}`}>
            {isImg ? (
              <div className={s.pillInner}>
                <img src={b} alt="" loading="lazy" />
                <span
                  className={s.editableUrl}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => onEdit(i)((e.currentTarget as HTMLSpanElement).innerText)}
                >
                  {b}
                </span>
              </div>
            ) : (
              <strong
                className={s.brandText}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onEdit(i)((e.currentTarget as HTMLSpanElement).innerText)}
              >
                {b}
              </strong>
            )}
          </div>
        );
      })}
    </div>
  );
}

function colsCls(c:"auto"|"double"|"triple"){ return c==="double"? (s as any)["columns-2"] : c==="triple"? (s as any)["columns-3"] : (s as any)["columns-auto"]; }
function densityCls(d:"compact"|"normal"|"spacious"){ return d==="compact"? (s as any).compact : d==="spacious"? (s as any).spacious : (s as any).normal; }
