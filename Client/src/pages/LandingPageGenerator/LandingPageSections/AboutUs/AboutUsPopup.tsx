"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";   // אותו קובץ CSS

type FontSize = "S" | "M" | "L";
type Cols     = "single" | "double";

export interface AboutUsOptions {
  template : number;   // 0-3
  fontSize : FontSize;
  columns  : Cols;
  showStats: boolean;
}

interface Props {
  open      : boolean;
  options   : AboutUsOptions;
  onChange  : (n: AboutUsOptions) => void;
  onClose   : () => void;
  anchorRef : React.RefObject<HTMLElement>;
  dir?      : "rtl" | "ltr";
}

export default function AboutUsPopup({
  open,
  options,
  onChange,
  onClose,
  anchorRef,
  dir = "rtl",
}: Props) {

  const popRef      = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState(options);
  const [pos,  setPos ]   = useState({ top: 0, left: 0, caretX: 24 });

  /* === sync props→state === */
  useEffect(() => setLocal(options), [options]);
  useEffect(() => onChange(local),   [local, onChange]);

  /* === esc / outside click === */
  useEffect(() => {
    if (!open) return;
    const key   = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const click = (e: MouseEvent) =>
      popRef.current && !popRef.current.contains(e.target as Node) && onClose();
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", click);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("mousedown", click);
    };
  }, [open, onClose]);

  /* === placement === */
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current;
      const b = popRef.current;
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const bw = b.offsetWidth  || 340;
      const bh = b.offsetHeight || 260;
      const gap = 8;
      let left = ar.left + ar.width / 2 - bw / 2;
      let top  = ar.bottom + gap;
      left = Math.max(8, Math.min(left, innerWidth  - bw - 8));
      top  = Math.max(8, Math.min(top , innerHeight - bh - 8));
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

        {/* תבניות */}
        <div className={styles.section}>
          <div className={styles.rowLabel}>טמפלייט</div>
          <div className={styles.layoutsRow}>
            {[0,1,2].map((i) => (
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

        {/* טקסט + עמודות + סטטיסטיקה */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>גודל כתב</span>
            <div className={styles.segment}>
              {(["S","M","L"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.fontSize === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, fontSize: k }))}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <label className={styles.rowCheck}>
            <input
              type="checkbox"
              checked={local.showStats}
              onChange={e => setLocal(p => ({ ...p, showStats: e.target.checked }))}
            />
            <span>הצג כרטיסי סטטיסטיקה</span>
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
