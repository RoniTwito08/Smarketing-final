// src/components/LandingPageSections/ContactUs/Variants/V2.tsx
"use client";
import s from "../contactUs.module.css";

export default function V2({
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
    <div className={`${s.v2} ${classes.tone} ${classes.radius}`}>
      <div className={s.v2Left}>
        <h2 className={s.title}>{title.replace("📞","💬")}</h2>
        <p className={s.subtitle}>{subtitle || "נחזור אליכם במהירות האפשרית עם תשובה מותאמת."}</p>
        <ul className={s.bullets}>
          <li>מענה מהיר ויעיל</li>
          <li>ליווי אישי לאורך כל הדרך</li>
          <li>פתרון מותאם לצרכים שלכם</li>
        </ul>
      </div>
      <div className={s.v2Right}>
        {renderForm()}
      </div>
      <div className={`${s.ribbon} ${classes.accent}`} aria-hidden />
    </div>
  );
}
