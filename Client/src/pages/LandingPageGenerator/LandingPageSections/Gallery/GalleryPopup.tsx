"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Hero/LayoutPopUp/LayoutPopUp.module.css";

export type Columns = "auto" | "double" | "triple";
export type Ratio = "auto" | "square" | "portrait" | "landscape";
export type Gap = "tight" | "normal" | "loose";

export interface GalleryOptions {
  template: number; // 0..2 (V1/V2/V3)
  columns: Columns; // עבור Grid בלבד (V1)
  ratio: Ratio;     // עבור Grid בלבד (V1)
  gap: Gap;         // כל הטמפלטים
  showCaptions: boolean;
  rounded: boolean;
}

interface Props {
  open: boolean;
  options: GalleryOptions;
  onChange: (n: GalleryOptions) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  dir?: "rtl" | "ltr";
}

export default function GalleryPopup({
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
  useEffect(() => {
    if (open) onChange(local);
  }, [local, open, onChange]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const click = (e: MouseEvent) =>
      popRef.current &&
      !popRef.current.contains(e.target as Node) &&
      onClose();
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
      const caretX = Math.max(
        14,
        Math.min(bw - 14, ar.left + ar.width / 2 - left)
      );
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
        style={{
          top: pos.top,
          left: pos.left,
          ["--caret-x" as any]: `${pos.caretX}px`,
        }}
        role="dialog"
        dir={dir}
      >
        <div className={styles.bubbleCaret} />

        {/* בחירת טמפלט */}
        <div className={styles.section}>
          <div className={styles.rowLabel}>טמפלט</div>
          <div className={styles.layoutsRow}>
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={`${styles.layoutBox} ${
                  local.template === i ? styles.layoutBoxActive : ""
                }`}
                onClick={() => setLocal((p) => ({ ...p, template: i }))}
                aria-pressed={local.template === i}
                title={["Grid", "Masonry", "Rows"][i]}
              >
                {String.fromCharCode(65 + i)}
              </button>
            ))}
          </div>
        </div>

        {/* פרמטרים משותפים */}
        <div className={styles.section}>
          <div className={styles.rowBetween}>
            <span className={styles.label}>מרווח</span>
            <div className={styles.segment}>
              {(["tight", "normal", "loose"] as const).map((k) => (
                <button
                  key={k}
                  className={`${styles.segmentBtn} ${
                    local.gap === k ? styles.active : ""
                  }`}
                  onClick={() => setLocal((p) => ({ ...p, gap: k }))}
                >
                  {k === "tight" ? "צמוד" : k === "normal" ? "רגיל" : "מרווח"}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.rowCheck}>
            <input
              type="checkbox"
              checked={local.showCaptions}
              onChange={(e) =>
                setLocal((p) => ({ ...p, showCaptions: e.target.checked }))
              }
            />
            <span>הצג כיתובים</span>
          </label>

          <label className={styles.rowCheck}>
            <input
              type="checkbox"
              checked={local.rounded}
              onChange={(e) =>
                setLocal((p) => ({ ...p, rounded: e.target.checked }))
              }
            />
            <span>פינות מעוגלות</span>
          </label>
        </div>

        {/* פרמטרים ספציפיים ל־Grid */}
        {local.template === 0 && (
          <div className={styles.section}>
            <div className={styles.rowBetween}>
              <span className={styles.label}>עמודות</span>
              <div className={styles.segment}>
                {(["auto", "double", "triple"] as const).map((k) => (
                  <button
                    key={k}
                    className={`${styles.segmentBtn} ${
                      local.columns === k ? styles.active : ""
                    }`}
                    onClick={() => setLocal((p) => ({ ...p, columns: k }))}
                  >
                    {k === "auto" ? "Auto" : k === "double" ? "2" : "3"}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rowBetween}>
              <span className={styles.label}>יחס תמונה</span>
              <div className={styles.segment}>
                {(["auto", "square", "portrait", "landscape"] as const).map(
                  (k) => (
                    <button
                      key={k}
                      className={`${styles.segmentBtn} ${
                        local.ratio === k ? styles.active : ""
                      }`}
                      onClick={() => setLocal((p) => ({ ...p, ratio: k }))}
                    >
                      {k === "square"
                        ? "1:1"
                        : k === "portrait"
                        ? "3:4"
                        : k === "landscape"
                        ? "16:9"
                        : "Auto"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

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
