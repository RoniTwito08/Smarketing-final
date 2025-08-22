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
  const years    = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
  const clients  = Math.floor(Math.random() * (900 - 150 + 1)) + 150;
  const rating   = (Math.round((4.7 + Math.random() * 0.3) * 10) / 10).toFixed(1);
  const projects = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
  return [
    { icon: "clock", label: "ותק",               value: String(years) },
    { icon: "users", label: "לקוחות מרוצים",     value: `+${clients}` },
    { icon: "star",  label: "דירוג",             value: rating },
    { icon: "done",  label: "השלמות",            value: `+${projects}` },
  ];
}, [incoming]);

export default function V2({
  lines = [],
  paragraph,
  tagline,
  bullets: bulletsProp = [
    "תמחור ברור ומדויק",
    "מענה מהיר וזמין",
    "ליווי מקצועי עד הסוף",
    "אחריות מלאה לשקט שלך",
    "המלצות חמות מלקוחות",
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

  const [pText, setPText]       = useState(paragraphInit);
  const [tagText, setTagText]   = useState(tagline || "");
  const [whyTitle, setWhyTitle] = useState("למה לבחור בנו?");
  const [bullets, setBullets]   = useState<string[]>(bulletsProp);
  const stats                   = useRandomStats(statsProp);
  const [callText, setCallText] = useState("התקשר עכשיו");
  const [waText, setWaText]     = useState("וואטסאפ");

  const onDivInput =
    (setter: (v: string) => void) =>
    (e: React.FormEvent<HTMLDivElement>) =>
      setter((e.currentTarget as HTMLDivElement).innerText);

  const onBulletInput =
    (i: number) =>
    (e: React.FormEvent<HTMLSpanElement>) => {
      const v = (e.currentTarget as HTMLSpanElement).innerText;
      setBullets(prev => { const next = [...prev]; next[i] = v; return next; });
    };

  return (
    <div className={s.v2Wrap} dir="rtl">
      <div className={s.v2Left}>
        <p
          className={`${s.v2Paragraph} ${s.editableAuto}`}
          contentEditable
          suppressContentEditableWarning
          dir="auto"
          onInput={onDivInput(setPText)}
        >
          {pText}
        </p>

        <div
          className={`${s.v2Tagline} ${s.editableAuto}`}
          contentEditable
          suppressContentEditableWarning
          dir="auto"
          onInput={onDivInput(setTagText)}
        >
          {tagText}
        </div>

        <div className={s.v2WhyBox}>
          <div
            className={`${s.v2WhyTitle} ${s.editableAuto}`}
            contentEditable
            suppressContentEditableWarning
            dir="auto"
            onInput={onDivInput(setWhyTitle)}
          >
            {whyTitle}
          </div>

          <ul className={s.v2WhyList}>
            {bullets.map((b, i) => (
              <li key={i}>
                <FaCheckCircle />
                <span
                  className={`${s.v2WhyItemText} ${s.editableAuto}`}
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
            <div className={s.v2StatValue} dir="auto">{st.value}</div>
            <div className={s.v2StatLabel} dir="auto">{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.v2Ctas}>
        {telHref && (
          <a href={telHref} className={`${s.v2Btn} ${s.v2BtnPrimary}`}>
            <FaPhoneAlt />
            <span
              className={`${s.v2CtaText} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={(e) => setCallText((e.currentTarget as HTMLSpanElement).innerText)}
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            >
              {callText}
            </span>
          </a>
        )}
        {waHref && (
          <a href={waHref} target="_blank" rel="noreferrer" className={`${s.v2Btn} ${s.v2BtnAlt}`}>
            <FaWhatsapp />
            <span
              className={`${s.v2CtaText} ${s.editableAuto}`}
              contentEditable
              suppressContentEditableWarning
              dir="auto"
              onInput={(e) => setWaText((e.currentTarget as HTMLSpanElement).innerText)}
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
