// src/components/LandingPageSections/ContactUs/ContactPopup.tsx
"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export interface ContactOptions {
  template: number;
  accent: "blue" | "emerald" | "violet" | "orange";
  radius: "md" | "lg" | "xl" | "full";
  tone: "solid" | "soft" | "glass";
  buttonIcon: "left" | "right" | "none";
  showConsent: boolean;
  showAltContacts: boolean;
  formStyle: "rounded" | "outlined" | "filled";
}

interface Props {
  open: boolean;
  options: ContactOptions;
  onChange: (n: ContactOptions) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;  // ⬅️ חדש
  dir?: "rtl" | "ltr";
}

export default function ContactPopup({
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
  useEffect(() => onChange(local), [local, onChange]);

  // סגירה על ESC/לחיצה חיצונית
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

  // מיקום מתחת לכפתור (Anchor)
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current;
      const b = popRef.current;
      if (!a || !b) return;

      const ar = a.getBoundingClientRect();
      const bw = b.offsetWidth || 420;
      const bh = b.offsetHeight || 420;
      const gap = 8;

      // מרכזים יחסית לכפתור, ומגבילים לגבולות המסך
      let left = ar.left + ar.width / 2 - bw / 2;
      let top = ar.bottom + gap;

      left = Math.max(8, Math.min(left, window.innerWidth - bw - 8));
      top  = Math.max(8, Math.min(top, window.innerHeight - bh - 8));

      // מיקום החץ לפי מרכז הכפתור
      const caretX = Math.max(14, Math.min(bw - 14, (ar.left + ar.width / 2) - left));

      setPos({ top, left, caretX });
    };

    // מיקום ראשוני + עדכונים
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
        ref={popRef}
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

        {/* Accent & Tone */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>צבע דגש</span>
            <div className={styles.segment}>
              {(["blue","emerald","violet","orange"] as const).map(k => (
                <button key={k} className={`${styles.segmentBtn} ${local.accent === k ? styles.active : ""}`} onClick={() => setLocal(p => ({ ...p, accent: k }))}>
                  {k === "blue" ? "כחול" : k === "emerald" ? "ירוק" : k === "violet" ? "סגול" : "כתום"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>טון רקע</span>
            <div className={styles.segment}>
              {(["solid","soft","glass"] as const).map(k => (
                <button key={k} className={`${styles.segmentBtn} ${local.tone === k ? styles.active : ""}`} onClick={() => setLocal(p => ({ ...p, tone: k }))}>
                  {k === "solid" ? "מלא" : k === "soft" ? "רך" : "Glass"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Radius & Input style */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>פינות</span>
            <div className={styles.segment}>
              {(["md","lg","xl","full"] as const).map(k => (
                <button key={k} className={`${styles.segmentBtn} ${local.radius === k ? styles.active : ""}`} onClick={() => setLocal(p => ({ ...p, radius: k }))}>
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.label}>סגנון טופס</span>
            <div className={styles.segment}>
              {(["rounded","outlined","filled"] as const).map(k => (
                <button key={k} className={`${styles.segmentBtn} ${local.formStyle === k ? styles.active : ""}`} onClick={() => setLocal(p => ({ ...p, formStyle: k }))}>
                  {k === "rounded" ? "מעוגל" : k === "outlined" ? "מסגרת" : "מלא"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className={styles.section}>
          <label className={styles.rowCheck}>
            <input type="checkbox" checked={local.showConsent} onChange={e => setLocal(p => ({ ...p, showConsent: e.target.checked }))} />
            <span>תיבת הסכמה לפרטיות</span>
          </label>
          <label className={styles.rowCheck}>
            <input type="checkbox" checked={local.showAltContacts} onChange={e => setLocal(p => ({ ...p, showAltContacts: e.target.checked }))} />
            <span>קישורי וואטסאפ/טלפון/אימייל</span>
          </label>

          <div className={styles.rowBetween}>
            <span className={styles.label}>אייקון בכפתור</span>
            <div className={styles.segment}>
              {(["none","left","right"] as const).map(k => (
                <button key={k} className={`${styles.segmentBtn} ${local.buttonIcon === k ? styles.active : ""}`} onClick={() => setLocal(p => ({ ...p, buttonIcon: k }))}>
                  {k === "none" ? "ללא" : k === "left" ? "שמאל" : "ימין"}
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
