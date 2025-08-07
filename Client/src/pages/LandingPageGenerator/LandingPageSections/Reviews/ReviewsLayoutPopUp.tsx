"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export interface ReviewsLayoutOptions {
  templateIndex: number;
  radius: number;
  blur: number;
  textAlign: "left" | "center" | "right";
  padding: "S" | "M" | "L";
}

interface Props {
  open: boolean;
  options: ReviewsLayoutOptions;
  onChange: (next: ReviewsLayoutOptions) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

const paddingLabel = { S: "קטן", M: "בינוני", L: "גדול" };
const textAlignLabel = (k: string) =>
  k === "right" ? "ימין" : k === "center" ? "מרכז" : "שמאל";

export default function ReviewsLayoutPopUp({
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) =>
      bubbleRef.current &&
      !bubbleRef.current.contains(e.target as Node) &&
      onClose();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(local);
    }, 100); // 100ms debounce
    return () => clearTimeout(timeout);
  }, [local]);


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
        aria-label="התאמת חוות דעת"
        dir={dir}
        style={{
          top: pos.top,
          left: pos.left,
          ["--caret-x" as any]: `${pos.caretX}px`,
        }}
      >
        <div className={styles.bubbleCaret} />

        {/* תבנית תצוגה */}
        <div className={styles.section}>
          <label className={styles.label}>תבנית תצוגה</label>
          <div className={styles.layoutsRow}>
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={`${styles.layoutBox} ${
                  local.templateIndex === i ? styles.layoutBoxActive : ""
                }`}
                onClick={() => setLocal((p) => ({ ...p, templateIndex: i }))}
                aria-pressed={local.templateIndex === i}
              >
                {["A", "B", "C"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* התאמות עיצוב */}
        <div className={styles.section}>
          <label className={styles.row}>
            <span className={styles.label}>רדיוס פינות</span>
            <input
              type="range"
              min={0}
              max={30}
              value={local.radius}
              onChange={(e) =>
                setLocal((p) => ({ ...p, radius: Number(e.target.value) }))
              }
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
              onChange={(e) =>
                setLocal((p) => ({ ...p, blur: Number(e.target.value) }))
              }
              className={styles.range}
            />
          </label>

          <div className={styles.rowBetween}>
            <label className={styles.label}>ריפוד</label>
            <div className={styles.segment}>
              {(["S", "M", "L"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${
                    local.padding === k ? styles.active : ""
                  }`}
                  onClick={() => setLocal((p) => ({ ...p, padding: k }))}
                  type="button"
                  aria-pressed={local.padding === k}
                >
                  {paddingLabel[k]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowBetween}>
            <label className={styles.label}>יישור טקסט</label>
            <div className={styles.segment}>
              {(["right", "center", "left"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${
                    local.textAlign === k ? styles.active : ""
                  }`}
                  onClick={() => setLocal((p) => ({ ...p, textAlign: k }))}
                  type="button"
                  aria-pressed={local.textAlign === k}
                >
                  {textAlignLabel(k)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.linkBtn} onClick={onClose}>
            סגור
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
