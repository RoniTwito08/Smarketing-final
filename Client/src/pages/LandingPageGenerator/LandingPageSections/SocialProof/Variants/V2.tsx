"use client";
import s from "../socialProof.module.css";

type Options = {
  density: "compact" | "normal" | "spacious";
  rounded: boolean;
  softBackground: boolean;
};

export default function V2({
  brands,
  options,
}: {
  brands: string[];
  options: Options;
}) {
  // דופליקציה קלה כדי שהמרקיז יראה מלא
  const line = [...brands, ...brands, ...brands].slice(0, Math.max(12, brands.length * 2));
  return (
    <div className={`${s.marqueeWrap} ${options.softBackground ? s.soft : ""}`}>
      <div className={s.marquee} aria-hidden>
        {line.map((b, i) => (
          <div key={i} className={`${s.pill} ${options.rounded ? s.rounded : ""}`}>
            {/\.(png|jpe?g|webp|svg)$/i.test(b) || /^https?:\/\//i.test(b) ? <img src={b} alt="" /> : <span>{b}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
