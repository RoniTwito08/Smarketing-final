"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// השתמש באותו CSS של LayoutPopup (כמו שביקשת)
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export type CardWidth = "M" | "L";
export type TextAlign = "right" | "center" | "left";
export type PaddingScale = "S" | "M" | "L";

export interface ServicesOptions {
  template: number;       // 0..3
  cardWidth: CardWidth;
  textAlign: TextAlign;
  radius: number;
  blur: number;
  padding: PaddingScale;
  showIcons: boolean;
}

interface Props {
  open: boolean;
  options: ServicesOptions;
  onChange: (n: ServicesOptions) => void;
  onClose: () => void;
  onPickTemplate: (index: number) => void;
  activeTemplate: number;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

const cardWidthLabel: Record<CardWidth, string> = { M: "בינוני", L: "רחב" };
const paddingLabel: Record<PaddingScale, string> = { S: "קטן", M: "בינוני", L: "גדול" };
const textAlignLabel = (k: TextAlign) => (k === "right" ? "ימין" : k === "center" ? "מרכז" : "שמאל");

export default function ServicesPopup({
  open,
  options,
  onChange,
  onClose,
  onPickTemplate,
  activeTemplate,
  anchorRef,
  dir = "rtl",
}: Props) {
  const popRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState(options);
  const [pos, setPos] = useState({ top: 0, left: 0, caretX: 24 });

  useEffect(() => setLocal(options), [options]);
  useEffect(() => onChange(local), [local, onChange]);

  // esc / click outside
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const click = (e: MouseEvent) => popRef.current && !popRef.current.contains(e.target as Node) && onClose();
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", click);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("mousedown", click);
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current;
      const b = popRef.current;
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const bw = b.offsetWidth || 380;
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
        ref={popRef}
        className={styles.bubble}
        style={{ top: pos.top, left: pos.left, ["--caret-x" as any]: `${pos.caretX}px` }}
        role="dialog"
        dir={dir}
      >
        <div className={styles.bubbleCaret} />

        {/* בחירת טמפלייטים A–D */}
        <div className={styles.section}>
          <div className={styles.layoutsRow}>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`${styles.layoutBox} ${activeTemplate === i ? styles.layoutBoxActive : ""}`}
                onClick={() => onPickTemplate(i)}
                title={`תבנית ${i + 1}`}
              >
                {String.fromCharCode(65 + i)}
              </button>
            ))}
          </div>
        </div>

        {/* התאמות כרטיס/טקסט */}
        <div className={styles.section}>
          {/* רוחב כרטיס */}
          <div className={styles.rowBetween}>
            <span className={styles.label}>רוחב כרטיס</span>
            <div className={styles.segment}>
              {(["M", "L"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.cardWidth === k ? styles.active : ""}`}
                  onClick={() => setLocal((p) => ({ ...p, cardWidth: k }))}
                >
                  {cardWidthLabel[k]}
                </button>
              ))}
            </div>
          </div>

          {/* יישור טקסט */}
          <div className={styles.rowBetween}>
            <span className={styles.label}>יישור טקסט</span>
            <div className={styles.segment}>
              {(["right", "center", "left"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.textAlign === k ? styles.active : ""}`}
                  onClick={() => setLocal((p) => ({ ...p, textAlign: k }))}
                >
                  {textAlignLabel(k)}
                </button>
              ))}
            </div>
          </div>

          {/* רדיוס */}
          <label className={styles.row}>
            <span className={styles.label}>רדיוס פינות</span>
            <input
              type="range"
              min={0}
              max={28}
              value={local.radius}
              onChange={(e) => setLocal((p) => ({ ...p, radius: Number(e.target.value) }))}
              className={styles.range}
            />
          </label>

          {/* ריפוד */}
          <div className={styles.rowBetween}>
            <span className={styles.label}>ריפוד</span>
            <div className={styles.segment}>
              {(["S", "M", "L"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.padding === k ? styles.active : ""}`}
                  onClick={() => setLocal((p) => ({ ...p, padding: k }))}
                >
                  {paddingLabel[k]}
                </button>
              ))}
            </div>
          </div>

          {/* איקונים */}
          <label className={styles.row}>
            <span className={styles.label}>אייקונים בכרטיסים</span>
            <input
              type="checkbox"
              checked={local.showIcons}
              onChange={(e) => setLocal((p) => ({ ...p, showIcons: e.target.checked }))}
            />
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
