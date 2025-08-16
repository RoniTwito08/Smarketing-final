// src/components/LandingPageSections/ContactUs/Variants/V1.tsx
"use client";
import s from "../contactUs.module.css";

export default function V1({
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
    <div className={`${s.v1} ${classes.tone}`}>
      <div className={`${s.card} ${classes.radius}`}>
        <h2 className={s.title}>{title}</h2>
        <p className={s.subtitle}>{subtitle}</p>
        {renderForm()}
      </div>

      {/* דקורציה */}
      <div className={`${s.blob} ${classes.accent}`} aria-hidden />
      <div className={`${s.ring} ${classes.accent}`} aria-hidden />
    </div>
  );
}
