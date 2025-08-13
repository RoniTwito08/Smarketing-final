// src/components/LandingPageSections/AboutUs/Variants/V4.tsx
"use client";
import s from "../aboutUs.module.css";
import {
  FaCheckCircle,
  FaClock,
  FaUserFriends,
  FaStar,
  FaClipboardCheck,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

type Stat = { icon?: "clock" | "users" | "star" | "done"; label: string; value: string };

type Props = {
  /** שורות טקסט (אם לא יגיע – ניקח paragraph) */
  lines?: string[];
  /** פסקה רציפה */
  paragraph?: string;
  /** כותרת הסקשן */
  heading?: string;
  /** תת־כותרת קצרה מודגשת */
  tagline?: string;
  /** למה לבחור בנו */
  bullets?: string[];
  /** סטטיסטיקות */
  stats?: Stat[];
  /** תמונת בעל העסק */
  imageUrl?: string;
  /** טלפון לחיוג */
  phone?: string;
  /** וואטסאפ – אם לא סופק ניקח מהטלפון */
  whatsappNumber?: string;
};

const iconFor = (k?: Stat["icon"]) => {
  switch (k) {
    case "clock":
      return <FaClock />;
    case "users":
      return <FaUserFriends />;
    case "star":
      return <FaStar />;
    case "done":
      return <FaClipboardCheck />;
    default:
      return <FaClipboardCheck />;
  }
};

export default function V4({
  lines = [],
  paragraph,
  tagline,
  bullets = [
    "אחריות מלאה על העבודה",
    "זמינות גבוהה גם לפרויקטים קטנים",
    "יחס אישי ואנושי",
    "ממליצים מרוצים לאורך זמן",
    "מחירים הוגנים ושקיפות מלאה",
  ],
  stats = [
    { icon: "clock", label: "שנות ניסיון בתחום", value: "3" },
    { icon: "users", label: "לקוחות מרוצים", value: "+75" },
    { icon: "star", label: "דירוג ממוצע", value: "4.9" },
    { icon: "done", label: "פרויקטים הושלמו", value: "+60" },
  ],
  imageUrl,
  phone,
  whatsappNumber,
}: Props) {
  const telHref = phone ? `tel:${phone.replace(/\s|-/g, "")}` : undefined;
  const waNum = (whatsappNumber || phone || "").replace(/[^\d]/g, "");
  const waHref = waNum ? `https://wa.me/${waNum}` : undefined;

  const textBlock = (paragraph && paragraph.trim().length ? paragraph : lines.join(" ")).trim();

  return (
    <div className={s.v4Wrap} dir="rtl">
      {/* שמאל: טקסט + “למה לבחור בנו” */}
      <div className={s.v4Left}>
        {textBlock && <p className={s.v4Paragraph}>{textBlock}</p>}

        {tagline && <div className={s.v4Tagline}>{tagline}</div>}

        <div className={s.v4WhyBox}>
          <div className={s.v4WhyTitle}>למה לבחור בנו?</div>
          <ul className={s.v4WhyList}>
            {bullets.map((b, i) => (
              <li key={i}>
                <FaCheckCircle /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ימין: תמונה עגולה + תג */}
      <div className={s.v4Right}>
        {imageUrl && (
          <div className={s.v4AvatarWrap}>
            <img className={s.v4Avatar} src={imageUrl} alt="" />
            <span className={s.v4Badge}>מורשה ומבוטח</span>
          </div>
        )}
      </div>

      {/* סטטיסטיקות */}
      <div className={s.v4StatsGrid}>
        {stats.map((st, i) => (
          <div key={i} className={s.v4StatCard}>
            <div className={s.v4StatIcon}>{iconFor(st.icon)}</div>
            <div className={s.v4StatValue}>{st.value}</div>
            <div className={s.v4StatLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={s.v4Ctas}>
        {telHref && (
          <a href={telHref} className={`${s.v4Btn} ${s.v4BtnPrimary}`}>
            <FaPhoneAlt /> התקשר עכשיו
          </a>
        )}
        {waHref && (
          <a href={waHref} target="_blank" rel="noreferrer" className={`${s.v4Btn} ${s.v4BtnWhatsApp}`}>
            <FaWhatsapp /> וואטסאפ
          </a>
        )}
      </div>
    </div>
  );
}
