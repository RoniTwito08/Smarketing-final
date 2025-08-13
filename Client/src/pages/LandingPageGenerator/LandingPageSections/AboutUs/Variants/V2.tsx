"use client";
import s from "../aboutUs.module.css";
import {
  FaCheckCircle, FaClock, FaUserFriends, FaStar, FaClipboardCheck, FaPhoneAlt, FaWhatsapp,
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

export default function V2({
  lines = [],
  paragraph,
  tagline,
  bullets = [
    "תמחור ברור ומדויק",
    "מענה מהיר וזמין",
    "ליווי מקצועי עד הסוף",
    "אחריות מלאה לשקט שלך",
    "המלצות חמות מלקוחות",
  ],
  stats = [
    { icon: "clock", label: "ותק", value: "3" },
    { icon: "users", label: "לקוחות מרוצים", value: "+75" },
    { icon: "star",  label: "דירוג", value: "4.9" },
    { icon: "done",  label: "השלמות", value: "+60" },
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
    <div className={s.v2Wrap} dir="rtl">
      <div className={s.v2Left}>
        {text && <p className={s.v2Paragraph}>{text}</p>}
        {tagline && <div className={s.v2Tagline}>{tagline}</div>}

        <div className={s.v2WhyBox}>
          <div className={s.v2WhyTitle}>למה לבחור בנו?</div>
          <ul className={s.v2WhyList}>
            {bullets.map((b, i) => (
              <li key={i}><FaCheckCircle /> {b}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.v2Right}>
        {imageUrl && (
          <figure className={s.v2Figure}>
            <img className={s.v2Img} src={imageUrl} alt="" />
          </figure>
        )}
      </div>

      <div className={s.v2StatsGrid}>
        {stats.map((st, i) => (
          <div key={i} className={s.v2StatCard}>
            <div className={s.v2StatIcon}>{iconFor(st.icon)}</div>
            <div className={s.v2StatValue}>{st.value}</div>
            <div className={s.v2StatLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.v2Ctas}>
        {telHref && (
          <a href={telHref} className={`${s.v2Btn} ${s.v2BtnPrimary}`}>
            <FaPhoneAlt /> התקשר עכשיו
          </a>
        )}
        {waHref && (
          <a href={waHref} target="_blank" rel="noreferrer" className={`${s.v2Btn} ${s.v2BtnAlt}`}>
            <FaWhatsapp /> וואטסאפ
          </a>
        )}
      </div>
    </div>
  );
}
