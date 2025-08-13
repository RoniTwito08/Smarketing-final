"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { FaPalette, FaTrash, FaImage, FaPlus } from "react-icons/fa";
import s from "./features.module.css";
import FeaturesLayoutPopUp, { FeaturesLayoutOptions } from "./FeaturesLayoutPopUp";
import FeaturesBackgroundChoosen from "./FeaturesBackgroundChoosen";
import { businessInfoService } from "../../../../services/besinessInfo.service";
import { useAuth } from "../../../../context/AuthContext";

// Variants
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";

interface FeaturesProps {
  content: string[];
  image: string;
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3];

export default function Features({ content, image, onDelete }: FeaturesProps) {
  const [services, setServices] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);

  const { user, accessToken } = useAuth();
  const userId = user?._id;
  const [businessField, setBusinessField] = useState<string>("business");

  useEffect(() => {
    if (!userId || !accessToken) return;
    businessInfoService
      .getBusinessInfo(userId, accessToken)
      .then((data) => setBusinessField(data.data.businessField || "business"))
      .catch(() => setBusinessField("business"));
  }, [userId, accessToken]);

  // תמונה שנבחרה (ברירת מחדל: מ־props)
  const [pickedImage, setPickedImage] = useState<string>(image);

  // אפשרויות עיצוב
  const [opts, setOpts] = useState<FeaturesLayoutOptions>({
    imageSide: "left",
    textAlign: "right",
    gridCols: 2,
    gap: 30,
    radius: 16,
    glassBlur: 10,
    showIcons: true,
    cardShadow: "soft",
  });

  const [openEditor, setOpenEditor] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [openImgPicker, setOpenImgPicker] = useState(false);
  const imgBtnRef = useRef<HTMLButtonElement>(null);

  // ניקוי הטקסט שהגיע כ־JSON מ־LLM (אותו קטע מהקוד שלך)
 useEffect(() => {
  // אם אין כלום
    if (!content) {
      setServices([]);
      return;
    }

    // כבר מגיע כ-array? מעולה — רק ננקה/נגביל לאורך
    if (Array.isArray(content)) {
      setServices(
        content
          .map((s) => (s ?? "").toString().trim())
          .filter(Boolean)
          .slice(0, 6)
      );
      return;
    }

    // אחרת, נסה לפרש כמחרוזת JSON (לשמירת תאימות אחורה)
    try {
      const parsed = JSON.parse(content as unknown as string);
      if (Array.isArray(parsed)) {
        setServices(
          parsed
            .map((s) => (s ?? "").toString().replace(/['",]/g, "").trim())
            .filter(Boolean)
            .slice(0, 6)
        );
        return;
      }
    } catch {
      // fallback: פיצול לפי שורות/פסיקים
      const fallback = (content as unknown as string)
        .split(/\r?\n|,/)
        .map((s) => s.replace(/['",\[\]]/g, "").trim())
        .filter(Boolean)
        .slice(0, 6);

      setServices(fallback);
    }
  }, [content]);


  // סנכרון שינוי חיצוני של תמונה
  useEffect(() => {
    setPickedImage(image);
  }, [image]);

  const handleBlur = (i: number, e: React.FocusEvent<HTMLSpanElement>) => {
    const txt = e.currentTarget.innerText;
    setServices((prev) => {
      const copy = [...prev];
      copy[i] = txt;
      return copy;
    });
  };

  const addService = () => {
    setServices((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, " יתרון חדש"];
    });
  };

  // CSS variables דינמיים (הקוד המקורי שלך)
  const featuresVars = useMemo<React.CSSProperties>(() => {
    const shadow =
      opts.cardShadow === "none"
        ? "none"
        : opts.cardShadow === "strong"
        ? "0 14px 34px rgba(0,0,0,.18)"
        : "0 8px 24px rgba(0,0,0,.10)";

    return {
      ["--feat-gap" as any]: `${opts.gap}px`,
      ["--feat-radius" as any]: `${opts.radius}px`,
      ["--feat-grid-cols" as any]: String(opts.gridCols),
      ["--feat-text-align" as any]: opts.textAlign,
      ["--feat-card-shadow" as any]: shadow,
      ["--feat-glass-blur" as any]: `${opts.glassBlur}px`,
    };
  }, [opts]);

  const atLimit = services.length >= 6;
  const currentImage = pickedImage || image;

  const ActiveVariant = VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, templateIndex))];

  // handlers לעריכה inline
  const handlers = (i: number) => ({ onBlur: (e: React.FocusEvent<HTMLSpanElement>) => handleBlur(i, e) });

  return (
    <section
      className={s.featuresSection}
      style={featuresVars}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* טולבר */}
      {isHovered && (
        <div className={s.toolbar}>
          <button
            ref={editBtnRef}
            type="button"
            className={s.iconBtn}
            onClick={() => setOpenEditor(true)}
            title="התאמה"
            aria-haspopup="dialog"
            aria-expanded={openEditor}
          >
            <FaPalette size={14} />
          </button>

          <button
            ref={imgBtnRef}
            type="button"
            className={s.iconBtn}
            onClick={() => setOpenImgPicker(true)}
            title="בחר תמונת פיצ'רים"
            aria-haspopup="dialog"
            aria-expanded={openImgPicker}
          >
            <FaImage size={14} />
          </button>

          <button
            type="button"
            className={`${s.iconBtn} ${atLimit ? s.iconBtnDisabled : ""}`}
            onClick={addService}
            title={atLimit ? "מקסימום 6 שורות" : "הוסף שורה"}
            aria-disabled={atLimit}
            disabled={atLimit}
          >
            <FaPlus size={14} />
          </button>

          {onDelete && (
            <button
              type="button"
              className={`${s.iconBtn} ${s.trashBtn}`}
              onClick={onDelete}
              title="מחק סקשן"
              aria-label="מחק סקשן"
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {/* וריאנט פעיל */}
      <ActiveVariant
        services={services}
        currentImage={currentImage}
        opts={{ textAlign: opts.textAlign, imageSide: opts.imageSide, gridCols: opts.gridCols }}
        handlers={handlers}
        withIcons={!!opts.showIcons}
      />

      {/* פופ־אפים */}
      <FeaturesLayoutPopUp
        open={openEditor}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenEditor(false)}
        onPickTemplate={(i) => setTemplateIndex(i)}
        activeTemplate={templateIndex}
        anchorRef={editBtnRef}
        dir="rtl"
      />

      <FeaturesBackgroundChoosen
        open={openImgPicker}
        onClose={() => setOpenImgPicker(false)}
        anchorRef={imgBtnRef}
        initialQuery={businessField}
        onPick={(url) => {
          setPickedImage(url);
          setOpenImgPicker(false);
        }}
        dir="rtl"
      />
    </section>
  );
}
