"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./layoutPopup.module.css";

export type Align = "top" | "center" | "bottom";
export type CardWidth = "M" | "L";
export type TextAlign = "right" | "center" | "left";
export type PaddingScale = "S" | "M" | "L";

export interface LayoutOptions {
  fullBleed: boolean;
  align: Align;
  cardWidth: CardWidth;
  textAlign: TextAlign;
  radius: number;
  blur: number;
  padding: PaddingScale;
}

interface LayoutPopUpProps {
  open: boolean;
  options: LayoutOptions;
  onChange: (next: LayoutOptions) => void;
  onClose: () => void;
  onPickTemplate: (index: number) => void;
  activeTemplate: number;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

export default function LayoutPopUp({
  open,
  options,
  onChange,
  onClose,
  onPickTemplate,
  activeTemplate,
  anchorRef,
  dir = "rtl",
}: LayoutPopUpProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<LayoutOptions>(options);
  const [pos, setPos] = useState<{ top: number; left: number; caretX: number }>({ top: 0, left: 0, caretX: 24 });

  useEffect(() => setLocal(options), [options]);

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

  // החלת שינויים החוצה
  useEffect(() => { onChange(local); /* eslint-disable-next-line */ }, [local]);

  // עיגון לבוטון — מחשב מיקום מדויק + זנב
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
      const buttonCenter = ar.left + ar.width / 2;
      const caretX = Math.max(14, Math.min(bw - 14, buttonCenter - left));
      setPos({ top, left, caretX });
    };
    const raf = requestAnimationFrame(place);
    const ro = new ResizeObserver(() => requestAnimationFrame(place));
    ro.observe(document.documentElement);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf);
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
        aria-label="התאמת ה־Hero"
        style={{ top: pos.top, left: pos.left, ["--caret-x" as any]: `${pos.caretX}px` }}
        dir={dir}
      >
        <div className={styles.bubbleCaret} aria-hidden="true" />

        {/* בחירת טמפלייט (A–G) + Full-bleed */}
        <div className={styles.section}>
          <div className={styles.layoutsRow} aria-label="Layout">
            {[0,1,2,3,4,5,6].map((i) => (
              <button
                key={i}
                className={`${styles.layoutBox} ${activeTemplate === i ? styles.layoutBoxActive : ""}`}
                title={`Template ${String.fromCharCode(65 + i)}`}
                onClick={() => onPickTemplate(i)}
                type="button"
                aria-pressed={activeTemplate === i}
              />
            ))}
            
          </div>
        </div>

        {/* תוכן / כרטיס — בלי רקע */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <label className={styles.label}>Card width</label>
            <div className={styles.segment}>
              {(["M","L"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.cardWidth === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({...p, cardWidth: k}))}
                  type="button"
                  aria-pressed={local.cardWidth === k}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <label className={styles.label}>Text align</label>
            <div className={styles.segment}>
              {(["right","center","left"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.textAlign === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({...p, textAlign: k}))}
                  type="button"
                  aria-pressed={local.textAlign === k}
                >
                  {k === "right" ? "⇤" : k === "center" ? "↔︎" : "⇥"}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.row}>
            <span className={styles.label}>Radius</span>
            <input
              type="range"
              min={0}
              max={28}
              value={local.radius}
              onChange={(e) => setLocal(p => ({...p, radius: Number(e.target.value)}))}
              className={styles.range}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>Backdrop blur</span>
            <input
              type="range"
              min={0}
              max={12}
              value={local.blur}
              onChange={(e) => setLocal(p => ({...p, blur: Number(e.target.value)}))}
              className={styles.range}
            />
          </label>

          <div className={styles.rowBetween}>
            <label className={styles.label}>Padding</label>
            <div className={styles.segment}>
              {(["S","M","L"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.padding === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({...p, padding: k}))}
                  type="button"
                  aria-pressed={local.padding === k}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.linkBtn} type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
