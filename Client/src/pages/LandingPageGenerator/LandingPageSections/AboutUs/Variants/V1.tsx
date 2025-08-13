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
  lines?: string[];
  paragraph?: string;
  heading?: string;
  tagline?: string;
  bullets?: string[];
  stats?: Stat[];
  imageUrl?: string;
  phone?: string;
  whatsappNumber?: string;
};

const iconFor = (k?: Stat["icon"]) => {
  switch (k) {
    case "clock": return <FaClock />;
    case "users": return <FaUserFriends />;
    case "star":  return <FaStar />;
    case "done":  return <FaClipboardCheck />;
    default:      return <FaClipboardCheck />;
  }
};

export default function V1({
  lines = [],
  paragraph,
  tagline,
  bullets = [
    "אמינות ושקיפות מלאה",
    "יחס אישי וסבלני",
    "תיאום מדויק ועמידה בזמנים",
    "חומרים וכלים איכותיים",
    "מחיר הוגן ללא הפתעות",
  ],
  stats = [
    { icon: "clock", label: "שנות ניסיון", value: "3" },
    { icon: "users", label: "לקוחות מרוצים", value: "+75" },
    { icon: "star",  label: "דירוג ממוצע", value: "4.9" },
    { icon: "done",  label: "פרויקטים הושלמו", value: "+60" },
  ],
  imageUrl,
  phone,
  whatsappNumber,
}: Props) {
  const telHref = phone ? `tel:${phone.replace(/\s|-/g, "")}` : undefined;
  const waNum   = (whatsappNumber || phone || "").replace(/[^\d]/g, "");
  const waHref  = waNum ? `https://wa.me/${waNum}` : undefined;

  const text = (paragraph && paragraph.trim().length ? paragraph : lines.join(" ")).trim();

  return (
    <div className={s.v1Wrap} dir="rtl">
      <div className={s.v1Left}>
        {text && <p className={s.v1Paragraph}>{text}</p>}
        {tagline && <div className={s.v1Tagline}>{tagline}</div>}

        <div className={s.v1WhyBox}>
          <div className={s.v1WhyTitle}>למה לבחור בנו?</div>
          <ul className={s.v1WhyList}>
            {bullets.map((b, i) => (
              <li key={i}><FaCheckCircle /> {b}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.v1Right}>
        {imageUrl && (
          <div className={s.v1AvatarWrap}>
            <img className={s.v1Avatar} src={imageUrl} alt="" />
            <span className={s.v1Badge}>מוסמך ומבוטח</span>
          </div>
        )}
      </div>

      <div className={s.v1StatsGrid}>
        {stats.map((st, i) => (
          <div key={i} className={s.v1StatCard}>
            <div className={s.v1StatIcon}>{iconFor(st.icon)}</div>
            <div className={s.v1StatValue}>{st.value}</div>
            <div className={s.v1StatLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.v1Ctas}>
        {telHref && (
          <a href={telHref} className={`${s.v1Btn} ${s.v1BtnPrimary}`}>
            <FaPhoneAlt /> התקשר עכשיו
          </a>
        )}
        {waHref && (
          <a href={waHref} target="_blank" rel="noreferrer" className={`${s.v1Btn} ${s.v1BtnAlt}`}>
            <FaWhatsapp /> וואטסאפ
          </a>
        )}
      </div>
    </div>
  );
}
