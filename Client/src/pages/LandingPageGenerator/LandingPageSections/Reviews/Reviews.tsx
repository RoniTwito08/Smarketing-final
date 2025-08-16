// src/components/LandingPageSections/Reviews/Reviews.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./reviews.module.css";
import { FaPalette, FaTrash, FaPlus, FaUser } from "react-icons/fa";
import ReviewsPopup, { ReviewsOptions } from "./ReviewsLayoutPopUp";
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";

export interface ReviewsProps {
  content?: string[] | string;            // יכול להגיע מערך או מחרוזת – נטפל בפנים
  title?: string;
  subtitle?: string;
  ratingSummary?: { average: number; count: number };
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3] as const;

export default function Reviews({
  content,
  title = "לקוחות מספרים",
  subtitle,
  ratingSummary,
  onDelete,
}: ReviewsProps) {
  const [hover, setHover] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [useRealImages, setUseRealImages] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  // אפשרויות עיצוב
  const [opts, setOpts] = useState<ReviewsOptions>({
    template: 0,              // 0..2
    radius: 16,
    blur: 0,
    textAlign: "right",
    padding: "M",
    showStars: true,
    maxCards: 6,
  });

  // ניקוי + נרמול תוכן נכנס
  const baseReviews = useMemo(() => {
    const toArray = (val?: string[] | string): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      // מפרקים במעברי שורה או פסיקים – למקרה שהתקבל טקסט ארוך
      return String(val)
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    };

    // ניקוי: הסרת גרשיים, רווחים כפולים, כפילויות, ואורך מינימלי
    const clean = (arr: string[]): string[] =>
      Array.from(
        new Set(
          arr
            .map((t) =>
              t
                .replace(/^["'\s]+|["'\s]+$/g, "")
                .replace(/\s{2,}/g, " ")
                .trim()
            )
            .filter((t) => t.length >= 6)
        )
      );

    const cleaned = clean(toArray(content));
    if (cleaned.length) return cleaned.slice(0, 12); // שומרים תקרה סבירה לפני maxCards
    // דיפולט – אם לא הגיע כלום
    return [
      "מקצועיות ברמה גבוהה והסבר ברור בכל שלב.",
      "שירות אדיב, תגובה מהירה ותוצאה מצוינת.",
      "עמדו בזמנים והפתיעו לטובה באיכות.",
      "תהליך נוח ושקוף – ממליץ בחום.",
    ];
  }, [content]);

  // סטייט של רשימת חוות דעת לעריכה חיה
  const [reviews, setReviews] = useState<string[]>(baseReviews);

  // סנכרון אם content משתנה מבחוץ
  useEffect(() => setReviews(baseReviews), [baseReviews]);

  // אינדקס אקראי לחצי כוכב (אם רוצים גיוון קל)
  const [randomIndex, setRandomIndex] = useState<number | null>(null);
  useEffect(() => {
    if (!reviews.length) return setRandomIndex(null);
    setRandomIndex(Math.floor(Math.random() * reviews.length));
  }, [reviews]);

  // הוספה/מחיקה/עדכון
  const addCard = () =>
    setReviews((p) =>
      p.length >= opts.maxCards ? p : [...p, "הוספת חוות דעת חדשה…"]
    );

  const delCard = (i: number) =>
    setReviews((p) => p.filter((_, j) => j !== i));

  const updateCard = (i: number, txt: string) =>
    setReviews((p) => {
      const c = [...p];
      c[i] = txt;
      return c;
    });

  // הגבלה לפי maxCards
  const visible = useMemo(() => reviews.slice(0, opts.maxCards), [reviews, opts.maxCards]);

  // קומפוננטת הווריאנט הפעיל
  const ActiveVariant = VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))];

  return (
    <section
      className={styles.reviewsSection}
      dir="rtl"
      style={{
        borderRadius: opts.radius,
        backdropFilter: `blur(${opts.blur}px)`,
        textAlign: opts.textAlign,
        padding: opts.padding === "S" ? "24px" : opts.padding === "L" ? "64px" : "40px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className={styles.toolbar}>
          {visible.length < opts.maxCards && (
            <button className={styles.iconBtn} onClick={addCard} title="הוסף כרטיס">
              <FaPlus size={14} />
            </button>
          )}
          <button
            className={styles.iconBtn}
            onClick={() => setUseRealImages((p) => !p)}
            title="החלף בין תמונות אמיתיות לאייקונים"
          >
            <FaUser size={14} />
          </button>
          <button
            ref={editBtnRef}
            className={styles.iconBtn}
            onClick={() => setOpenPop(true)}
            title="ערוך עיצוב"
          >
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button className={`${styles.iconBtn} ${styles.trashBtn}`} onClick={onDelete} title="מחק סקשן">
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {(title || subtitle || ratingSummary) && (
        <header className={styles.header}>
          {title && <h2 className={styles.heading}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {ratingSummary && Number.isFinite(ratingSummary.average) && Number.isFinite(ratingSummary.count) && (
            <p className={styles.agg}>
              דירוג ממוצע: <b>{ratingSummary.average.toFixed(1)}</b> ·
              <span> {ratingSummary.count} חוות דעת</span>
            </p>
          )}
        </header>
      )}

      <div className={styles.wrapper}>
        <ActiveVariant
          items={visible}
          randomIndex={randomIndex}
          useRealImages={useRealImages}
          onDeleteCard={delCard}
          onChangeText={updateCard}
          showStars={opts.showStars}
        />
      </div>

      {openPop && (
        <ReviewsPopup
          open={openPop}
          options={opts}
          onChange={setOpts}
          onClose={() => setOpenPop(false)}
          anchorRef={editBtnRef}
          dir="rtl"
        />
      )}
    </section>
  );
}
