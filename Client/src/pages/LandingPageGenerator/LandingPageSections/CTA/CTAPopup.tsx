// src/components/LandingPageSections/CTA/CTAPopup.tsx
"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export interface CTAOptions {
  template: number;                           // 0..2
  size: "sm" | "md" | "lg";
  style: "solid" | "outline" | "ghost";
  color: "primary" | "neutral" | "accent";
  align: "start" | "center" | "end" | "justify";
  rounded: "pill" | "md" | "none";
  gap: "tight" | "normal" | "loose";
  showIcons: boolean;
  fullWidthOnMobile: boolean;
}

interface Props {
  open: boolean;
  options: CTAOptions;
  onChange: (next: CTAOptions) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

export default function CTAPopup({
  open,
  options,
  onChange,
  onClose,
  anchorRef,
  dir = "rtl",
}: Props) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState(options);
  const [pos, setPos] = useState({ top: 0, left: 0, caretX: 24 });

  useEffect(() => setLocal(options), [options]);
  useEffect(() => onChange(local), [local, onChange]);

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
      const bw = b.offsetWidth || 420;
      const bh = b.offsetHeight || 420;
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
            {[0,1,2].map(i => (
              <button
                key={i}
                className={`${styles.layoutBox} ${local.template === i ? styles.layoutBoxActive : ""}`}
                onClick={() => setLocal(p => ({ ...p, template: i }))}
                aria-pressed={local.template === i}
              >
                {["A","B","C"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* Size / Style */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>גודל</span>
            <div className={styles.segment}>
              {(["sm","md","lg"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.size === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, size: k }))}
                >
                  {k === "sm" ? "קטן" : k === "md" ? "רגיל" : "גדול"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>סגנון</span>
            <div className={styles.segment}>
              {(["solid","outline","ghost"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.style === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, style: k }))}
                >
                  {k === "solid" ? "מלא" : k === "outline" ? "מסגרת" : "Ghost"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color / Align */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>צבע</span>
            <div className={styles.segment}>
              {(["primary","neutral","accent"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.color === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, color: k }))}
                >
                  {k === "primary" ? "ראשי" : k === "neutral" ? "נייטרלי" : "דגש"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>יישור</span>
            <div className={styles.segment}>
              {(["start","center","end","justify"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.align === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, align: k }))}
                >
                  {k === "start" ? "ימין" : k === "center" ? "מרכז" : k === "end" ? "שמאל" : "ישר"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rounded / Gap / Toggles */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>פינות</span>
            <div className={styles.segment}>
              {(["pill","md","none"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.rounded === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, rounded: k }))}
                >
                  {k === "pill" ? "מעוגל" : k === "md" ? "בינוני" : "ללא"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>מרווח</span>
            <div className={styles.segment}>
              {(["tight","normal","loose"] as const).map(k => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${local.gap === k ? styles.active : ""}`}
                  onClick={() => setLocal(p => ({ ...p, gap: k }))}
                >
                  {k === "tight" ? "צפוף" : k === "normal" ? "רגיל" : "מרווח"}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.rowCheck}>
            <input
              type="checkbox"
              checked={local.showIcons}
              onChange={e => setLocal(p => ({ ...p, showIcons: e.target.checked }))}
            />
            <span>אייקונים בכפתורים</span>
          </label>

          <label className={styles.rowCheck}>
            <input
              type="checkbox"
              checked={local.fullWidthOnMobile}
              onChange={e => setLocal(p => ({ ...p, fullWidthOnMobile: e.target.checked }))}
            />
            <span>רוחב מלא במובייל</span>
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
