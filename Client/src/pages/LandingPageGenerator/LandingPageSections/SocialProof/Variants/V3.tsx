"use client";
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
  return (
    <div className={`${s.grid} ${colsCls(options.columns)} ${densityCls(options.density)} ${options.softBackground ? s.soft : ""}`}>
      {brands.map((b, i) => (
        <div key={i} className={`${s.card} ${options.rounded ? s.rounded : ""}`}>
          {/\.(png|jpe?g|webp|svg)$/i.test(b) || /^https?:\/\//i.test(b)
            ? <img src={b} alt="" loading="lazy" />
            : <strong className={s.brandText}>{b}</strong>
          }
        </div>
      ))}
    </div>
  );
}

function colsCls(c:"auto"|"double"|"triple"){ return c==="double"? (s as any)["columns-2"] : c==="triple"? (s as any)["columns-3"] : (s as any)["columns-auto"]; }
function densityCls(d:"compact"|"normal"|"spacious"){ return d==="compact"? (s as any).compact : d==="spacious"? (s as any).spacious : (s as any).normal; }
