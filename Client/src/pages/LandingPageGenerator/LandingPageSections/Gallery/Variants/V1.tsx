"use client";
import s from "../gallery.module.css";
import { useState } from "react";

type Options = {
  columns: "auto" | "double" | "triple";
  ratio: "auto" | "square" | "portrait" | "landscape";
  gap: "tight" | "normal" | "loose";
  showCaptions: boolean;
  rounded: boolean;
};

export default function V1({
  images,
  options,
  onFileSelect,
  onOpenPicker,
  onRemove,
  onReplace,
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
    <div
      className={`${s.grid} ${colsCls(options.columns)} ${gapCls(options.gap)} ${ratioCls(
        options.ratio
      )} ${options.rounded ? s.rounded : ""}`}
    >
      {images.map((src, i) => (
        <Tile
          key={i}
          index={i}
          src={src}
          showCaption={options.showCaptions}
          onFileSelect={onFileSelect}
          onOpenPicker={onOpenPicker}
          onRemove={onRemove}
          onReplace={onReplace}
          busy={!!uploading?.[i]}
          errorMsg={errors?.[i] || null}
          ratioClass={ratioCls(options.ratio)}
        />
      ))}
    </div>
  );
}

function Tile({
  index,
  src,
  showCaption,
  onFileSelect,
  onOpenPicker,
  onRemove,
  busy,
  errorMsg,
  ratioClass,
}: {
  index: number;
  src: string;
  showCaption: boolean;
  onFileSelect: (index: number, file: File | null | undefined) => void;
  onOpenPicker: (index: number, anchorEl: HTMLElement) => void;
  onRemove: (index: number) => void;
  onReplace: (index: number) => void;
  busy: boolean;
  errorMsg: string | null;
  ratioClass: string;
}) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) onFileSelect(index, f);
  };

  return (
    <figure
      className={`${s.item} ${ratioClass} ${dragActive ? s.dropActive : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      <span className={s.badge}>{index + 1}</span>

      {/* כפתור מחיקה קטן בקצה */}
      <button
        className={s.removeBtn}
        type="button"
        title="הסר סלוט"
        onClick={() => onRemove(index)}
      >
        🗑️
      </button>

      <div className={`${s.imgWrap} ${src ? "hasImage" : ""}`}>
        {src ? (
          <>
            <img src={src} alt="" loading="lazy" />
            <div className={s.overlayGrad} />
          </>
        ) : (
          <div className={s.placeholder}>
            <div className={s.placeholderInner}>
              <div>גררו תמונה לכאן</div>
              <div className={s.placeholderBtns}>
                <input
                  id={`file-input-${index}`}
                  type="file"
                  accept="image/*"
                  className={s.hiddenInput}
                  onChange={(e) =>
                    onFileSelect(index, e.currentTarget.files?.[0])
                  }
                />
                <button
                  className={`${s.pBtn} ${s.uploadBtn}`}
                  type="button"
                  onClick={() =>
                    (document.getElementById(
                      `file-input-${index}`
                    ) as HTMLInputElement | null)?.click()
                  }
                  title="העלה מהמחשב"
                >
                  📤 העלאה
                </button>
                <button
                  className={`${s.pBtn} ${s.pexelsBtn}`}
                  type="button"
                  onClick={(e) => onOpenPicker(index, e.currentTarget as HTMLElement)}
                  title="בחר מתמונות"
                >
                  📷 בחר תמונה
                </button>
              </div>
            </div>
          </div>
        )}

        {/* מצב העלאה */}
        {busy && (
          <div className={s.busyOverlay} aria-label="מעלה לשרת">
            <div className={s.spinner} />
          </div>
        )}
      </div>

      {showCaption && <figcaption>תמונה #{index + 1}</figcaption>}

      {/* פעולות כשהתמונה קיימת: החלפה/הסרה (מופיע בהובר) */}
      {src && (
        <div className={s.actions}>
          <input
            id={`file-input-${index}`}
            type="file"
            accept="image/*"
            className={s.hiddenInput}
            onChange={(e) => onFileSelect(index, e.currentTarget.files?.[0])}
          />
          <button
            className={`${s.actBtn} ${s.replaceBtn}`}
            type="button"
            onClick={() =>
              (document.getElementById(
                `file-input-${index}`
              ) as HTMLInputElement | null)?.click()
            }
            title="החלף תמונה"
          >
            🔁 החלף
          </button>
          <button
            className={`${s.actBtn} ${s.removeBtnTone}`}
            type="button"
            onClick={() => onRemove(index)}
            title="הסר תמונה"
          >
            ✖︎ הסר
          </button>
          <button
            className={`${s.actBtn} ${s.pexelsBtn}`}
            type="button"
            onClick={(e) => onOpenPicker(index, e.currentTarget as HTMLElement)}
            title="בחר מתמונות"
          >
            📷 בחר
          </button>
        </div>
      )}

      {errorMsg && <div className={s.errorMsg}>שגיאה: {errorMsg}</div>}
    </figure>
  );
}

function colsCls(c: "auto" | "double" | "triple") {
  return c === "double"
    ? (s as any)["columns-2"]
    : c === "triple"
    ? (s as any)["columns-3"]
    : (s as any)["columns-auto"];
}
function ratioCls(r: "auto" | "square" | "portrait" | "landscape") {
  return r === "square"
    ? (s as any).square
    : r === "portrait"
    ? (s as any).portrait
    : r === "landscape"
    ? (s as any).landscape
    : "";
}
function gapCls(g: "tight" | "normal" | "loose") {
  return g === "tight"
    ? (s as any).gapTight
    : g === "loose"
    ? (s as any).gapLoose
    : (s as any).gapNormal;
}
