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
  const years    = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
  const clients  = Math.floor(Math.random() * (850 - 120 + 1)) + 120;
  const rating   = (Math.round((4.7 + Math.random() * 0.3) * 10) / 10).toFixed(1);
  const projects = Math.floor(Math.random() * (600 - 80 + 1)) + 80;
  return [
    { icon: "clock", label: "שנות ניסיון בתחום", value: String(years) },
    { icon: "users", label: "לקוחות מרוצים",     value: `+${clients}` },
    { icon: "star",  label: "דירוג ממוצע",       value: rating },
    { icon: "done",  label: "פרויקטים הושלמו",   value: `+${projects}` },
  ];
}, [incoming]);

export default function V4({
  lines = [],
  paragraph,
  tagline,
  bullets: bulletsProp = [
    "אחריות מלאה על העבודה",
    "זמינות גבוהה גם לפרויקטים קטנים",
    "יחס אישי ואנושי",
    "ממליצים מרוצים לאורך זמן",
    "מחירים הוגנים ושקיפות מלאה",
  ],
  stats: statsProp,
  imageUrl,
  phone,
  whatsappNumber,
}: Props) {
  const telHref = phone ? `tel:${phone.replace(/\s|-/g, "")}` : undefined;
  const waNum   = (whatsappNumber || phone || "").replace(/[^\d]/g, "");
  const waHref  = waNum ? `https://wa.me/${waNum}` : undefined;

  const textBlockInit = useMemo(
    () => (paragraph && paragraph.trim().length ? paragraph : lines.join(" ")).trim(),
    [paragraph, lines]
  );

  const [pText, setPText]       = useState(textBlockInit);
  const [tagText, setTagText]   = useState(tagline || "");
  const [whyTitle, setWhyTitle] = useState("למה לבחור בנו?");
  const [bullets, setBullets]   = useState<string[]>(bulletsProp);
  const stats                   = useRandomStats(statsProp);
  const [badgeText, setBadgeText] = useState("מורשה ומבוטח");
  const [callText, setCallText]   = useState("התקשר עכשיו");
  const [waText, setWaText]       = useState("וואטסאפ");

  const onDivInput =
    (setter: (v: string) => void) =>
    (e: React.FormEvent<HTMLDivElement>) =>
      setter((e.currentTarget as HTMLDivElement).innerText);

  const onSpanInput =
    (setter: (v: string) => void) =>
    (e: React.FormEvent<HTMLSpanElement>) =>
      setter((e.currentTarget as HTMLSpanElement).innerText);

  const onBulletInput =
    (i: number) =>
    (e: React.FormEvent<HTMLSpanElement>) => {
      const v = (e.currentTarget as HTMLSpanElement).innerText;
      setBullets(prev => { const next = [...prev]; next[i] = v; return next; });
    };

  return (
    <div className={s.v4Wrap} dir="rtl">
      <div className={s.v4Left}>
        <p
          className={`${s.v4Paragraph} ${s.editableAuto}`}
          contentEditable
          suppressContentEditableWarning
          dir="auto"
          onInput={onDivInput(setPText)}
        >
          {pText}
        </p>

        <div
          className={`${s.v4Tagline} ${s.editableAuto}`}
          contentEditable
          suppressContentEditableWarning
          dir="auto"
          onInput={onDivInput(setTagText)}
        >
          {tagText}
        </div>

        <div className={s.v4WhyBox}>
          <div
            className={`${s.v4WhyTitle} ${s.editableAuto}`}
            contentEditable
            suppressContentEditableWarning
            dir="auto"
            onInput={onDivInput(setWhyTitle)}
          >
            {whyTitle}
          </div>
          <ul className={s.v4WhyList}>
            {bullets.map((b, i) => (
              <li key={i}>
                <FaCheckCircle />
                <span
                  className={`${s.v4WhyItemText} ${s.editableAuto}`}
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

      <div className={s.v4Right}>
        {imageUrl && (
          <div className={s.v4AvatarWrap}>
            <img className={s.v4Avatar} src={imageUrl} alt="" />
            <span
              className={`${s.v4Badge} ${s.editableAuto}`}
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

      <div className={s.v4StatsGrid}>
        {stats.map((st, i) => (
          <div key={i} className={s.v4StatCard}>
            <div className={s.v4StatIcon}>{iconFor(st.icon)}</div>
            <div className={s.v4StatValue} dir="auto">{st.value}</div>
            <div className={s.v4StatLabel} dir="auto">{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.v4Ctas}>
        {telHref && (
          <a href={telHref} className={`${s.v4Btn} ${s.v4BtnPrimary}`}>
            <FaPhoneAlt />
            <span
              className={`${s.v4CtaText} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={onSpanInput(setCallText)}
            >
              {callText}
            </span>
          </a>
        )}
        {waHref && (
          <a href={waHref} target="_blank" rel="noreferrer" className={`${s.v4Btn} ${s.v4BtnWhatsApp}`}>
            <FaWhatsapp />
            <span
              className={`${s.v4CtaText} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={onSpanInput(setWaText)}
            >
              {waText}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
