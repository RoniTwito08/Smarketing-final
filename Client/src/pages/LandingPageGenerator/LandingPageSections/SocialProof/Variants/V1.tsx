"use client";
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
  return (
    <div className={`${s.grid} ${colsCls(options.columns)} ${densityCls(options.density)} ${options.rounded ? s.rounded : ""} ${options.softBackground ? s.soft : ""}`}>
      {brands.map((b, i) => (
        <BrandPill key={i} textOrUrl={b} />
      ))}
    </div>
  );
}

function BrandPill({ textOrUrl }: { textOrUrl: string }) {
  const isImg = /\.(png|jpe?g|webp|svg)$/i.test(textOrUrl) || (/^https?:\/\//i.test(textOrUrl) && !/\s/.test(textOrUrl));
  return (
    <div className={s.pill}>
      {isImg ? <img src={textOrUrl} alt="" loading="lazy" /> : <span>{textOrUrl}</span>}
    </div>
  );
}

function colsCls(c:"auto"|"double"|"triple"){ return c==="double"? (s as any)["columns-2"] : c==="triple"? (s as any)["columns-3"] : (s as any)["columns-auto"]; }
function densityCls(d:"compact"|"normal"|"spacious"){ return d==="compact"? (s as any).compact : d==="spacious"? (s as any).spacious : (s as any).normal; }
