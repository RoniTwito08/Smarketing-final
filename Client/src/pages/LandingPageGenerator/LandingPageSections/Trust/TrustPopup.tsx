// src/components/LandingPageSections/Trust/TrustPopup.tsx
"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

type Columns = "auto" | "single" | "double" | "triple" | "quad";
type Density = "compact" | "normal" | "spacious";
type Shape = "rounded" | "pill" | "square";
type Accent = "primary" | "secondary" | "tertiary";

export interface TrustOptions {
  template: number;       // 0..3
  columns: Columns;
  density: Density;
  showBadges: boolean;
  showIcons: boolean;
  equalHeights: boolean;
  shape: Shape;
  accent: Accent;
}

interface Props {
  open: boolean;
  options: TrustOptions;
  onChange: (n: TrustOptions) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

export default function TrustPopup({
  open,
  options,
  onChange,
  onClose,
  anchorRef,
  dir = "rtl",
}: Props) {
  const popRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState(options);
  const [pos, setPos] = useState({ top: 0, left: 0, caretX: 24 });

  useEffect(() => setLocal(options), [options]);
  useEffect(() => { if (open) onChange(local); }, [local, open]); // עדכון חי

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const click = (e: MouseEvent) =>
      popRef.current && !popRef.current.contains(e.target as Node) && onClose();
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
      const bw = b.offsetWidth || 400;
      const bh = b.offsetHeight || 360;
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

        {/* Template */}
        <div className={styles.section}>
          <div className={styles.rowLabel}>טמפלייט</div>
          <div className={styles.layoutsRow}>
            {[0,1,2,3].map(i => (
              <button
                key={i}
                className={`${styles.layoutBox} ${local.template === i ? styles.layoutBoxActive : ""}`}
                onClick={() => setLocal(p => ({ ...p, template: i }))}
                aria-pressed={local.template === i}
              >
                {String.fromCharCode(65 + i)}
              </button>
            ))}
          </div>
        </div>

        {/* Columns & Density */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>עמודות</span>
            <div className={styles.segment}>
              {(["auto","single","double","triple","quad"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.columns === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, columns: k }))}
                >
                  {k === "auto" ? "Auto" : k === "single" ? "1" : k === "double" ? "2" : k === "triple" ? "3" : "4"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>מרווח</span>
            <div className={styles.segment}>
              {(["compact","normal","spacious"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.density === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, density: k }))}
                >
                  {k === "compact" ? "קומפקטי" : k === "normal" ? "רגיל" : "מרווח"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className={styles.section}>
          {[
            ["showIcons","הצג אייקונים"],
            ["showBadges","הצג תגיות אמון"],
            ["equalHeights","גובה כרטיסים שווה"],
          ].map(([key, label]) => (
            <label key={key} className={styles.rowCheck}>
              <input
                type="checkbox"
                checked={(local as any)[key]}
                onChange={e => setLocal(p => ({ ...p, [key]: e.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Shape & Accent */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>צורה</span>
            <div className={styles.segment}>
              {(["rounded","pill","square"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.shape === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, shape: k }))}
                >
                  {k === "rounded" ? "עגול" : k === "pill" ? "גלולה" : "מרובע"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>הדגשה</span>
            <div className={styles.segment}>
              {(["primary","secondary","tertiary"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.accent === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, accent: k }))}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.linkBtn} onClick={onClose}>סגור</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
