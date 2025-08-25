"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash, FaPlus } from "react-icons/fa";
import s from "./gallery.module.css";
import GalleryPopup, { GalleryOptions } from "./GalleryPopup";
import t from "../Services/Services.module.css";
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";
import BackgroundPickerPopUp from "../Hero/backgroundPickerPopUp/backgroundPickerPopUp";
import { config } from "../../../../config";

export interface GalleryProps {
  title?: string;
  subtitle?: string;
  cover?: string;
  images?: string[];
  onDelete?: () => void;
  showHeader?: boolean;
  /** אם תרצה *כן* לטעון תמונות מ־props על ההרצה הראשונה, הפוך ל-true */
  prefillFromProps?: boolean;
}

// טמפלטים זמינים
const VARIANTS = [V1, V2, V3] as const;

// BASE URL: קונפיג > NEXT_PUBLIC_API_URL / VITE_API_URL > ריק
const API_BASE =
  (config as any)?.apiUrl ||
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_API_URL as string)) ||
  // @ts-ignore - Vite environments
  (typeof import.meta !== "undefined" && (import.meta as any)?.env?.VITE_API_URL) ||
  "";

const UPLOAD_ENDPOINT = "/api/upload-image"; // עדכן אם ה־endpoint שלך שונה

// מצב השתקת שגיאות ב־UI
const SILENCE_ERRORS = true;

export default function Gallery({
  title = "מהעבודות שלנו",
  subtitle,
  cover,
  images,
  onDelete,
  showHeader = true,
  prefillFromProps = false,
}: GalleryProps) {
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  // ✅ הצגת טולבר רק על hover
  const [hovered, setHovered] = useState(false);

  // בורר תמונות (Pexels/רקע)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);
  const pickerAnchorRef = useMemo(
    () => ({ current: pickerAnchor }) as React.RefObject<HTMLElement>,
    [pickerAnchor]
  );

  // מצבי העלאה/שגיאה פר־אריח
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [errorAt, setErrorAt] = useState<Record<number, string | null>>({});

  // אפשרויות תצוגה ועריכת טמפלט
  const [opts, setOpts] = useState<GalleryOptions>({
    template: 0,          // 0: Grid, 1: Masonry, 2: Rows
    columns: "auto",      // grid בלבד
    ratio: "auto",        // grid בלבד
    gap: "normal",
    showCaptions: false,
    rounded: true,
  });

  // מתחילים ריק לגמרי (אלא אם prefillFromProps=true)
  const initialFromProps = useMemo<string[]>(() => {
    if (!prefillFromProps) return [];
    const fromProps = [
      ...(cover ? [cover] : []),
      ...(Array.isArray(images) ? images.filter(Boolean) : []),
    ];
    return fromProps.slice(0, 24);
  }, [prefillFromProps, cover, images]);

  const [localImages, setLocalImages] = useState<string[]>(initialFromProps);

  // הוספת סלוט (כפתור פלוס בטולבר)
  const addSlot = () =>
    setLocalImages((prev) => (prev.length >= 24 ? prev : [...prev, ""]));

  // מחיקה של סלוט ספציפי
  const removeAt = (index: number) =>
    setLocalImages((prev) => prev.filter((_, i) => i !== index));

  // החלפה/עדכון URL בסלוט
  const setImageAt = (index: number, url: string) => {
    setLocalImages((prev) => {
      const next = [...prev];
      while (next.length <= index) next.push("");
      next[index] = url;
      return next;
    });
  };

  const hasImages = useMemo(
    () => localImages.some((u) => typeof u === "string" && u.trim() !== ""),
    [localImages]
  );

  // העלאה לשרת — מחזיר URL מוחלט
  async function uploadFileToServer(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}${UPLOAD_ENDPOINT}`, {
      method: "POST",
      body: fd,
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `HTTP ${res.status}`);
    }
    if (ct.includes("application/json")) {
      const data = await res.json();
      const url = data.url || data.path || data.fileUrl || "";
      if (!url) throw new Error("No URL returned from server");
      return /^https?:\/\//i.test(url)
        ? url
        : `${API_BASE}/${String(url).replace(/^\/+/, "")}`;
    }
    const txt = await res.text();
    return /^https?:\/\//i.test(txt)
      ? txt
      : `${API_BASE}/${txt.replace(/^\/+/, "")}`;
  }

  // בחירת קובץ: פריוויו מיידי -> העלאה -> החלפה ב־URL של השרת
  const handleFileSelect = async (index: number, file?: File | null) => {
    if (!file) return;
    // לא מציגים שגיאה למשתמש — מאפסים בכל מקרה
    setErrorAt((p) => ({ ...p, [index]: null }));

    const preview = URL.createObjectURL(file);
    setImageAt(index, preview);
    setUploading((p) => ({ ...p, [index]: true }));
    try {
      const serverUrl = await uploadFileToServer(file);
      setImageAt(index, serverUrl);
    } catch (e: any) {
      // שקט ב־UI: רק לוג למפתחים
      console.error("Upload failed at index", index, e);
      // מבטלים סימון שגיאה כדי שלא יוצג בשום מקום
      setErrorAt((p) => ({ ...p, [index]: null }));
      // אופציונלי: להסיר את ה־preview במקרה כשל
      // setImageAt(index, "");
    } finally {
      setUploading((p) => ({ ...p, [index]: false }));
    }
  };

  // פתיחת בחירה מ־BackgroundPickerPopUp (Pexels/חיפוש)
  const handleOpenPicker = (index: number, anchorEl: HTMLElement) => {
    setPickerIndex(index);
    setPickerAnchor(anchorEl);
    setPickerOpen(true);
  };

  // תוצאת בחירה מה־Picker
  const handlePickFromPicker = (url: string) => {
    if (pickerIndex != null) setImageAt(pickerIndex, url);
    setPickerOpen(false);
    setPickerIndex(null);
  };

  // helper לפתיחת הקובץ הראשון
  const ensureSlotAndOpenFile = (i = 0) => {
    setLocalImages((prev) => {
      if (prev.length > i) return prev;
      const next = [...prev];
      while (next.length <= i) next.push("");
      return next;
    });
    requestAnimationFrame(() => {
      const input = document.getElementById(`file-input-${i}`) as HTMLInputElement | null;
      input?.click();
    });
  };

  // פתיחת בורר לתמונה הראשונה כשהגלריה ריקה
  const openPickerForFirst = (anchorEl: HTMLElement) => {
    setLocalImages((prev) => (prev.length ? prev : [""]));
    setPickerIndex(0);
    setPickerAnchor(anchorEl);
    setPickerOpen(true);
  };

  // בחירת טמפלט אקטיבי לפי opts.template
  const ActiveVariant =
    VARIANTS[Math.min(VARIANTS.length - 1, Math.max(0, opts.template))] as any;

  return (
    <section
      className={s.gallerySection}
      dir="rtl"
      data-gallery="true"
      data-has-images={hasImages ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* טולבר — מוצג רק על Hover */}
      {hovered && (
        <div className={t.toolbar} aria-label="פעולות גלריה">
          <button
            className={t.iconBtn}
            title="הוסף תמונה"
            onClick={addSlot}
          >
            <FaPlus size={14} />
          </button>

          <button
            ref={editBtnRef}
            className={t.iconBtn}
            title="ערוך תצוגה וטמפלט"
            onClick={() => setOpenPop(true)}
          >
            <FaPalette size={14} />
          </button>

          {typeof onDelete === "function" && (
            <button
              className={`${t.iconBtn} ${t.trashBtn}`}
              title="מחק סקשן"
              onClick={onDelete}
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {/* כותרת (אופציונלי) */}
      {showHeader && (title || subtitle) && (
        <header className={s.header}>
          {title && <h2 className={s.heading}>{title}</h2>}
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </header>
      )}

      {/* כשהגלריה ריקה — Empty State */}
      {localImages.length === 0 ? (
        <div
          className={s.empty}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f && f.type.startsWith("image/")) {
              setLocalImages((prev) => (prev.length ? prev : [""]));
              handleFileSelect(0, f);
            }
          }}
        >
          <div className={s.emptyInner}>
            <div className={s.emptyIcon} aria-hidden>🖼️</div>
            <h3 className={s.emptyTitle}>הגלריה ריקה</h3>
            <p className={s.emptySub}>העלו תמונה ראשונה או בחרו מספרייה</p>

            {/* input נסתר עבור קובץ ראשון */}
            <input
              id="file-input-0"
              type="file"
              accept="image/*"
              className={s.hiddenInput}
              onChange={(e) =>
                e.currentTarget.files?.[0] && handleFileSelect(0, e.currentTarget.files[0])
              }
            />

            <div className={s.emptyActions}>
              <button
                type="button"
                className={`${s.pBtn} ${s.uploadBtn}`}
                onClick={() => ensureSlotAndOpenFile(0)}
              >
                📤 העלאה מהמחשב
              </button>
              <button
                type="button"
                className={`${s.pBtn} ${s.pexelsBtn}`}
                onClick={(e) => openPickerForFirst(e.currentTarget as HTMLElement)}
              >
                📷 בחר מתמונות
              </button>
            </div>

            <div className={s.emptyHint}>או גררו תמונה לכאן</div>
          </div>
        </div>
      ) : (
        /* אחרת — מציגים את הטמפלט האקטיבי */
        <ActiveVariant
          images={localImages}
          options={opts}
          onFileSelect={handleFileSelect}
          onOpenPicker={handleOpenPicker}
          onRemove={removeAt}
          onReplace={(i: number) => {
            const input = document.getElementById(`file-input-${i}`) as HTMLInputElement | null;
            input?.click();
          }}
          uploading={uploading}
          /* משתק את שגיאות ה־UI ע"י העברת אובייקט ריק */
          errors={SILENCE_ERRORS ? {} : errorAt}
        />
      )}

      {/* פופ־אפ עיצוב טמפלט */}
      <GalleryPopup
        open={openPop}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenPop(false)}
        anchorRef={editBtnRef}
        dir="rtl"
      />

      {/* בורר תמונות (Pexels/חיפוש) */}
      <BackgroundPickerPopUp
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePickFromPicker}
        anchorRef={pickerAnchorRef}
        initialQuery="portfolio work"
        dir="rtl"
      />
    </section>
  );
}
