// src/components/LandingPageSections/Reviews/ReviewsPopup.tsx
"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export type ReviewsOptions = {
  template: number;                 // 0..2
  radius: number;                   // פינות
  blur: number;                     // טשטוש רקע
  textAlign: "left" | "center" | "right";
  padding: "S" | "M" | "L";
  showStars: boolean;
  maxCards: number;                 // הגבלת כרטיסים
};

interface Props {
  open: boolean;
  options: ReviewsOptions;
  onChange: (next: ReviewsOptions) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

const paddingLabel = { S: "קטן", M: "בינוני", L: "גדול" };
const textAlignLabel = (k: string) =>
  k === "right" ? "ימין" : k === "center" ? "מרכז" : "שמאל";

export default function ReviewsPopup({
  open,
  options,
  onChange,
  onClose,
  anchorRef,
  dir = "rtl",
}: Props) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<ReviewsOptions>(options);
  const [pos, setPos] = useState({ top: 0, left: 0, caretX: 24 });

  useEffect(() => setLocal(options), [options]);
  useEffect(() => { if (open) onChange(local); }, [local]); // עדכון חי

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) =>
      bubbleRef.current && !bubbleRef.current.contains(e.target as Node) && onClose();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current;
      const b = bubbleRef.current;
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const bw = b.offsetWidth || 360;
      const bh = b.offsetHeight || 320;
      const gap = 8;
      let left = ar.left + ar.width / 2 - bw / 2;
      let top = ar.bottom + gap;
      left = Math.max(8, Math.min(left, innerWidth - bw - 8));
      top = Math.max(8, Math.min(top, innerHeight - bh - 8));
      const caretX = Math.max(14, Math.min(bw - 14, ar.left + ar.width / 2 - left));
      setPos({ top, left, caretX });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div className={styles.portalRoot} aria-hidden={!open}>
      <div
        ref={bubbleRef}
        className={styles.bubble}
        role="dialog"
        dir={dir}
        style={{ top: pos.top, left: pos.left, ["--caret-x" as any]: `${pos.caretX}px` }}
      >
        <div className={styles.bubbleCaret} />

        {/* Template */}
        <div className={styles.section}>
          <div className={styles.rowLabel}>טמפלייט</div>
          <div className={styles.layoutsRow}>
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={`${styles.layoutBox} ${local.template === i ? styles.layoutBoxActive : ""}`}
                onClick={() => setLocal((p) => ({ ...p, template: i }))}
                aria-pressed={local.template === i}
              >
                {["A", "B", "C"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className={styles.section}>
          <label className={styles.row}>
            <span className={styles.label}>רדיוס פינות</span>
            <input
              type="range"
              min={0}
              max={30}
              value={local.radius}
              onChange={(e) => setLocal((p) => ({ ...p, radius: Number(e.target.value) }))}
              className={styles.range}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>טשטוש רקע</span>
            <input
              type="range"
              min={0}
              max={12}
              value={local.blur}
              onChange={(e) => setLocal((p) => ({ ...p, blur: Number(e.target.value) }))}
              className={styles.range}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>מס׳ כרטיסים</span>
            <input
              type="range"
              min={1}
              max={12}
              value={local.maxCards}
              onChange={(e) => setLocal((p) => ({ ...p, maxCards: Number(e.target.value) }))}
              className={styles.range}
            />
          </label>
        </div>

        {/* Segments */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>ריפוד</span>
            <div className={styles.segment}>
              {(["S", "M", "L"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.padding === k ? styles.active : ""}`}
                  onClick={() => setLocal((p) => ({ ...p, padding: k }))}
                  aria-pressed={local.padding === k}
                >
                  {paddingLabel[k]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>יישור טקסט</span>
            <div className={styles.segment}>
              {(["right", "center", "left"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.textAlign === k ? styles.active : ""}`}
                  onClick={() => setLocal((p) => ({ ...p, textAlign: k }))}
                  aria-pressed={local.textAlign === k}
                >
                  {textAlignLabel(k)}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.rowCheck}>
            <input
              type="checkbox"
              checked={local.showStars}
              onChange={(e) => setLocal((p) => ({ ...p, showStars: e.target.checked }))}
            />
            <span>הצג כוכבים</span>
          </label>
        </div>

        <div className={styles.footer}>
          <button className={styles.linkBtn} onClick={onClose}>סגור</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
