// src/components/LandingPageSections/ContactUs/Variants/V3.tsx
"use client";
import s from "../contactUs.module.css";

export default function V3({
  title,
  subtitle,
  renderForm,
  classes,
}: {
  title: string;
  subtitle: string;
  renderForm: () => JSX.Element;
  classes: { accent: string; tone: string; radius: string };
}) {
  return (
    <div className={`${s.v3}`}>
      <div className={`${s.glass} ${classes.radius}`}>
        <h2 className={s.title}>{title.replace("📞","📬")}</h2>
        <p className={s.subtitle}>{subtitle || "אנחנו כאן עבורכם בכל שאלה!"}</p>
        {renderForm()}
      </div>

      {/* דקורציה */}
      <div className={`${s.gradientBg} ${classes.accent}`} aria-hidden />
      <div className={s.floatingDots} aria-hidden />
    </div>
  );
}
