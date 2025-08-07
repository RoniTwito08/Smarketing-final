"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export type ImageSide = "left" | "right" | "top";
export type TextAlign = "right" | "center" | "left";
export type CardShadow = "none" | "soft" | "strong";

export interface FeaturesLayoutOptions {
  imageSide: ImageSide;   // לאיזה צד יוצב ה־image בטמפלט 0
  textAlign: TextAlign;   // יישור טקסט לרשימות/כרטיסים
  gridCols: number;       // מס' עמודות בטמפלט 1 (grid)
  gap: number;            // מרווח כללי בין אלמנטים (px)
  radius: number;         // רדיוס לכרטיסים/תמונה
  glassBlur: number;      // עוצמת blur של “זכוכית” בטמפלט 1
  showIcons: boolean;     // להציג אייקון "וי" בכרטיסים/רשימות
  cardShadow: CardShadow; // עוצמת צל לכרטיסים
}

interface Props {
  open: boolean;
  options: FeaturesLayoutOptions;
  onChange: (next: FeaturesLayoutOptions) => void;
  onClose: () => void;
  onPickTemplate: (index: number) => void;
  activeTemplate: number;           // 0/1/2 לתבניות שלך
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

export default function FeaturesLayoutPopUp({
  open,
  options,
  onChange,
  onClose,
  onPickTemplate,
  activeTemplate,
  anchorRef,
  dir = "rtl",
}: Props) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<FeaturesLayoutOptions>(options);
  const [pos, setPos] = useState({ top: 0, left: 0, caretX: 24 });

  useEffect(() => setLocal(options), [options]);
  useEffect(() => { onChange(local); /* eslint-disable-next-line */ }, [local]);

  // סגירה ב־Esc/קליק־חוץ
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  // עיגון לפלואטינג־כפתור
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = anchorRef?.current;
      const bubble = bubbleRef.current;
      if (!anchor || !bubble) return;
      const ar = anchor.getBoundingClientRect();
      const bw = bubble.offsetWidth || 360;
      const bh = bubble.offsetHeight || 300;
      const gap = 8;
      let left = ar.left + ar.width / 2 - bw / 2;
      let top = ar.bottom + gap;
      left = Math.max(8, Math.min(left, window.innerWidth - bw - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - bh - 8));
      const caretX = Math.max(14, Math.min(bw - 14, ar.left + ar.width / 2 - left));
      setPos({ top, left, caretX });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(document.documentElement);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div className={styles.portalRoot} aria-hidden={!open}>
      <div
        ref={bubbleRef}
        className={styles.bubble}
        role="dialog"
        aria-modal="false"
        aria-label="התאמת ה־Features"
        style={{ top: pos.top, left: pos.left, ["--caret-x" as any]: `${pos.caretX}px` }}
        dir={dir}
      >
        <div className={styles.bubbleCaret} aria-hidden />

        {/* בחירת טמפלט 0/1/2 */}
        <div className={styles.section}>
          <div className={styles.layoutsRow} aria-label="Templates">
            {[0,1,2].map((i) => (
              <button
                key={i}
                className={`${styles.layoutBox} ${activeTemplate === i ? styles.layoutBoxActive : ""}`}
                title={`Template ${i}`}
                onClick={() => onPickTemplate(i)}
                type="button"
                aria-pressed={activeTemplate === i}
              />
            ))}
          </div>
        </div>

        {/* צדי תמונה + יישור טקסט */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <label className={styles.label}>Image side (Template 0)</label>
            <div className={styles.segment}>
              {(["left","right","top"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.imageSide === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({...p, imageSide: k}))}
                  type="button"
                  aria-pressed={local.imageSide === k}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* עמודות / ריווח / רדיוס / טשטוש */}
        <div className={styles.section}>
          <label className={styles.row}>
            <span className={styles.label}>Grid columns (Template 1)</span>
            <input
              type="range" min={1} max={4}
              value={local.gridCols}
              onChange={(e) => setLocal(p => ({...p, gridCols: Number(e.target.value)}))}
              className={styles.range}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>Gap (px)</span>
            <input
              type="range" min={8} max={60}
              value={local.gap}
              onChange={(e) => setLocal(p => ({...p, gap: Number(e.target.value)}))}
              className={styles.range}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>Radius</span>
            <input
              type="range" min={0} max={28}
              value={local.radius}
              onChange={(e) => setLocal(p => ({...p, radius: Number(e.target.value)}))}
              className={styles.range}
            />
          </label>
        </div>

        {/* אייקונים + צל */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <label className={styles.label}>Show icons</label>
            <div className={styles.segment}>
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  className={`${styles.segmentBtn} ${local.showIcons === v ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({...p, showIcons: v}))}
                  type="button"
                  aria-pressed={local.showIcons === v}
                >
                  {v ? "On" : "Off"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <label className={styles.label}>Card shadow</label>
            <div className={styles.segment}>
              {(["none","soft","strong"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.cardShadow === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({...p, cardShadow: k}))}
                  type="button"
                  aria-pressed={local.cardShadow === k}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
