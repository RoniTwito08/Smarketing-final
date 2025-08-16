"use client";
import React, { useMemo, useState } from "react";
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

const useRandomStats = (incoming?: Stat[]) => useMemo<Stat[]>(() => {
  if (incoming && incoming.length) return incoming;
  const years    = Math.floor(Math.random() * (11 - 3 + 1)) + 3;
  const clients  = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
  const rating   = (Math.round((4.7 + Math.random() * 0.3) * 10) / 10).toFixed(1);
  const projects = Math.floor(Math.random() * (800 - 120 + 1)) + 120;
  return [
    { icon: "clock", label: "שנות ניסיון",      value: String(years) },
    { icon: "users", label: "לקוחות מרוצים",    value: `+${clients}` },
    { icon: "star",  label: "דירוג ממוצע",      value: rating },
    { icon: "done",  label: "פרויקטים הושלמו",  value: `+${projects}` },
  ];
}, [incoming]);

export default function V1({
  lines = [],
  paragraph,
  tagline,
  bullets: bulletsProp = [
    "אמינות ושקיפות מלאה",
    "יחס אישי וסבלני",
    "תיאום מדויק ועמידה בזמנים",
    "חומרים וכלים איכותיים",
    "מחיר הוגן ללא הפתעות",
  ],
  stats: statsProp,
  imageUrl,
  phone,
  whatsappNumber,
}: Props) {
  const telHref = phone ? `tel:${phone.replace(/\s|-/g, "")}` : undefined;
  const waNum   = (whatsappNumber || phone || "").replace(/[^\d]/g, "");
  const waHref  = waNum ? `https://wa.me/${waNum}` : undefined;

  const paragraphInit = useMemo(
    () => (paragraph && paragraph.trim().length ? paragraph : lines.join(" ")).trim(),
    [paragraph, lines]
  );

  const [pText, setPText]         = useState(paragraphInit);
  const [tagText, setTagText]     = useState(tagline || "");
  const [whyTitle, setWhyTitle]   = useState("למה לבחור בנו?");
  const [badgeText, setBadgeText] = useState("מוסמך ומבוטח");
  const [callText, setCallText]   = useState("התקשר עכשיו");
  const [waText, setWaText]       = useState("וואטסאפ");
  const [bullets, setBullets]     = useState<string[]>(bulletsProp);

  const stats = useRandomStats(statsProp);

  // bidi helpers
    const calcDir = (s: string) => {
      if (/[\u0590-\u05FF\u0600-\u06FF]/.test(s)) return "rtl"; // עברית/ערבית
      if (/[A-Za-z]/.test(s)) return "ltr";                     // לטינית
      return "ltr";                                             // מספרים/סימנים -> LTR
    };

    const onDivInput =
      (setter: (v: string) => void) =>
      (e: React.FormEvent<HTMLDivElement>) => {
        const el = e.currentTarget as HTMLDivElement;
        const text = el.innerText;
        setter(text);
        el.dir = calcDir(text); // מעדכן כיוון בלייב
      };

    const onSpanInput =
      (setter: (v: string) => void) =>
      (e: React.FormEvent<HTMLSpanElement>) => {
        const el = e.currentTarget as HTMLSpanElement;
        const text = el.innerText;
        setter(text);
        el.dir = calcDir(text);
      };


  const onBulletInput =
    (i: number) =>
    (e: React.FormEvent<HTMLSpanElement>) => {
      const v = (e.currentTarget as HTMLSpanElement).innerText;
      setBullets(prev => { const next = [...prev]; next[i] = v; return next; });
    };

  return (
    <div className={s.v1Wrap} dir="rtl">
      <div className={s.v1Left}>
        <p
          className={`${s.v1Paragraph} ${s.editableAuto}`}
          contentEditable
          suppressContentEditableWarning
          dir="auto"
          onInput={onDivInput(setPText)}
        >
          {pText}
        </p>

        <div
          className={`${s.v1Tagline} ${s.editableAuto}`}
          contentEditable
          suppressContentEditableWarning
          dir="auto"
          onInput={onDivInput(setTagText)}
        >
          {tagText}
        </div>

        <div className={s.v1WhyBox}>
          <div
            className={`${s.v1WhyTitle} ${s.editableAuto}`}
            contentEditable
            suppressContentEditableWarning
            dir="auto"
            onInput={onDivInput(setWhyTitle)}
          >
            {whyTitle}
          </div>

          <ul className={s.v1WhyList}>
            {bullets.map((b, i) => (
              <li key={i}>
                <FaCheckCircle />
                <span
                  className={`${s.v1WhyItemText} ${s.editableAuto}`}
                  contentEditable
                  suppressContentEditableWarning
                  dir="auto"
                  onInput={onBulletInput(i)}
                >
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.v1Right}>
        {imageUrl && (
          <div className={s.v1AvatarWrap}>
            <img className={s.v1Avatar} src={imageUrl} alt="" />
            <span
              className={`${s.v1Badge} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={onSpanInput(setBadgeText)}
            >
              {badgeText}
            </span>
          </div>
        )}
      </div>

      <div className={s.v1StatsGrid}>
        {stats.map((st, i) => (
          <div key={i} className={s.v1StatCard}>
            <div className={s.v1StatIcon}>{iconFor(st.icon)}</div>
            <div className={s.v1StatValue} dir="auto">{st.value}</div>
            <div className={s.v1StatLabel} dir="auto">{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.v1Ctas}>
        {telHref && (
          <a href={telHref} className={`${s.v1Btn} ${s.v1BtnPrimary}`}>
            <FaPhoneAlt />
            <span
              className={`${s.v1CtaText} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={onSpanInput(setCallText)}
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            >
              {callText}
            </span>
          </a>
        )}
        {waHref && (
          <a href={waHref} target="_blank" rel="noreferrer" className={`${s.v1Btn} ${s.v1BtnAlt}`}>
            <FaWhatsapp />
            <span
              className={`${s.v1CtaText} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={onSpanInput(setWaText)}
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            >
              {waText}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
