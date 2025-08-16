"use client";
import s from "../gallery.module.css";

type Options = {
  gap: "tight" | "normal" | "loose";
  showCaptions: boolean;
  rounded: boolean;
};

export default function V2({
  images,
  options,
  onFileSelect,
  onOpenPicker,
  onRemove,
  uploading,
  errors,
}: {
  images: string[];
  options: Options;
  onFileSelect: (index: number, file: File | null | undefined) => void;
  onOpenPicker: (index: number, anchorEl: HTMLElement) => void;
  onRemove: (index: number) => void;
  onReplace: (index: number) => void;
  uploading?: Record<number, boolean>;
  errors?: Record<number, string | null>;
}) {
  return (
    <div className={`${s.masonry} ${gapCls(options.gap)} ${options.rounded ? s.rounded : ""}`}>
      {images.map((src, i) => (
        <figure key={i} className={s.msItem}>
          <span className={s.badge}>{i + 1}</span>
          <button
            className={s.removeBtn}
            type="button"
            title="הסר סלוט"
            onClick={() => onRemove(i)}
          >
            🗑️
          </button>

          <div style={{ position: "relative" }}>
            {src ? (
              <>
                <img src={src} alt="" loading="lazy" />
                <div className={s.overlayGrad} />
              </>
            ) : (
              <div className={s.placeholder}>
                <div className={s.placeholderInner}>
                  <div>בחרו או העלו תמונה</div>
                  <div className={s.placeholderBtns}>
                    <input
                      id={`file-input-${i}`}
                      type="file"
                      accept="image/*"
                      className={s.hiddenInput}
                      onChange={(e) =>
                        onFileSelect(i, e.currentTarget.files?.[0])
                      }
                    />
                    <button
                      className={`${s.pBtn} ${s.uploadBtn}`}
                      type="button"
                      onClick={() =>
                        (document.getElementById(
                          `file-input-${i}`
                        ) as HTMLInputElement | null)?.click()
                      }
                    >
                      📤 העלאה
                    </button>
                    <button
                      className={`${s.pBtn} ${s.pexelsBtn}`}
                      type="button"
                      onClick={(e) => onOpenPicker(i, e.currentTarget as HTMLElement)}
                    >
                      📷 בחר תמונה
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploading?.[i] && (
              <div className={s.busyOverlay}>
                <div className={s.spinner} />
              </div>
            )}
          </div>

          {options.showCaptions && <figcaption>תמונה #{i + 1}</figcaption>}

          {src && (
            <div className={s.actions}>
              <input
                id={`file-input-${i}`}
                type="file"
                accept="image/*"
                className={s.hiddenInput}
                onChange={(e) => onFileSelect(i, e.currentTarget.files?.[0])}
              />
              <button
                className={`${s.actBtn} ${s.replaceBtn}`}
                type="button"
                onClick={() =>
                  (document.getElementById(
                    `file-input-${i}`
                  ) as HTMLInputElement | null)?.click()
                }
              >
                🔁 החלף
              </button>
              <button
                className={`${s.actBtn} ${s.removeBtnTone}`}
                type="button"
                onClick={() => onRemove(i)}
              >
                ✖︎ הסר
              </button>
              <button
                className={`${s.actBtn} ${s.pexelsBtn}`}
                type="button"
                onClick={(e) => onOpenPicker(i, e.currentTarget as HTMLElement)}
              >
                📷 בחר
              </button>
            </div>
          )}

          {errors?.[i] && <div className={s.errorMsg}>שגיאה: {errors[i]}</div>}
        </figure>
      ))}
    </div>
  );
}

function gapCls(g: "tight" | "normal" | "loose") {
  return g === "tight"
    ? (s as any).gapTight
    : g === "loose"
    ? (s as any).gapLoose
    : (s as any).gapNormal;
}
