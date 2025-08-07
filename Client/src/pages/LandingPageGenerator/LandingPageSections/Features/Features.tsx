import { useState, useEffect, useMemo, useRef } from "react";
import { FaCheckCircle, FaPalette, FaTrash, FaImage, FaPlus } from "react-icons/fa";
import featuresStyles from "./features.module.css";
import FeaturesLayoutPopUp, {
  FeaturesLayoutOptions,
} from "./FeaturesLayoutPopUp";
import FeaturesBackgroundChoosen from "./FeaturesBackgroundChoosen";
import { businessInfoService } from "../../../../services/besinessInfo.service";
import { useAuth } from "../../../../context/AuthContext";

interface FeaturesProps {
  content: string[];
  image: string;
  onDelete?: () => void;
}

export default function Features({ content, image, onDelete }: FeaturesProps) {
  const [services, setServices] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const { user, accessToken } = useAuth();
  const userId = user?._id;
  // Only fetch businessType if userId and accessToken are defined
  const [businessField, setBusinessField] = useState<string>("business");
  
  useEffect(() => {
    if (!userId || !accessToken) return;
    businessInfoService.getBusinessInfo(userId, accessToken)
      .then((data) => {
        setBusinessField(data.data.businessField || "business");
      })
      .catch(() => setBusinessField("business"));
  }, [userId, accessToken]);
  // תמונה שנבחרה מהפופ־אפ (ברירת מחדל: מה־props)
  const [pickedImage, setPickedImage] = useState<string>(image);

  // אפשרויות עיצוב לסקשן
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

  // פופ־אפ לבחירת תמונת פיצ'רים
  const [openImgPicker, setOpenImgPicker] = useState(false);
  const imgBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const cleaned = content
      .slice(2, content.length - 3)
      .map((s) => s.replace(/['",]/g, "").trim())
      .slice(0, 6); // ⬅️ לא יותר מ-5 כבר מהקלט
    setServices(cleaned);
  }, [content]);

  // אם התמונה מהשרת השתנתה מבחוץ — נעדכן גם אצלנו
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

  // ⬅️ הוספה של שורה חדשה (מוגבל ל-5)
  const addService = () => {
    setServices((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, "✔️ יתרון חדש"];
    });
  };

  // CSS Variables דינמיים
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

  // עזר ל־class side
  const sideClass =
    opts.imageSide === "right"
      ? featuresStyles.rowReverse
      : opts.imageSide === "top"
      ? featuresStyles.column
      : "";

  const maybeIcon = opts.showIcons ? <FaCheckCircle /> : null;

  // נשתמש תמיד ב־pickedImage (אם לא נבחרה—זו שב־props)
  const currentImage = pickedImage || image;

  const template0 = (
    <div className={`${featuresStyles.twoColLayout} ${sideClass}`}>
      <img src={currentImage} className={featuresStyles.featuresImage} />
      <ul className={featuresStyles.featuresList} style={{ textAlign: opts.textAlign as any }}>
        {services.map((s, i) => (
          <li key={i} className={featuresStyles.featureItem}>
            {maybeIcon}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(i, e)}
              className={featuresStyles.featureText}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const template1 = (
    <div className={featuresStyles.glassWrapper}>
      <img src={currentImage} className={featuresStyles.glassImage} />
      <div
        className={featuresStyles.glassGrid}
        style={{ gridTemplateColumns: `repeat(var(--feat-grid-cols), 1fr)`, textAlign: opts.textAlign as any }}
      >
        {services.map((s, i) => (
          <div key={i} className={featuresStyles.glassCard}>
            {maybeIcon}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(i, e)}
              className={featuresStyles.featureText}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const template2 = (
    <div className={featuresStyles.fancyWrapper}>
      <div className={featuresStyles.fancyHero}>
        <img src={currentImage} className={featuresStyles.fancyImage} />
      </div>
      <div className={featuresStyles.fancyCards}>
        {services.map((s, i) => (
          <div
            key={i}
            className={featuresStyles.fancyCard}
            style={{ ["--tilt" as any]: `${i % 2 === 0 ? -6 : 6}deg` }}
          >
            {maybeIcon}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(i, e)}
              className={featuresStyles.featureText}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const templates = [template0, template1, template2];

  const atLimit = services.length >= 6;

  return (
    <section
      className={featuresStyles.featuresSection}
      style={featuresVars}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* טולבר: התאמה + בחירת תמונה + הוסף שורה + מחיקה */}
      {isHovered && (
        <div className={featuresStyles.toolbar}>
          <button
            ref={editBtnRef}
            type="button"
            className={featuresStyles.iconBtn}
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
            className={featuresStyles.iconBtn}
            onClick={() => setOpenImgPicker(true)}
            title="בחר תמונת פיצ'רים"
            aria-haspopup="dialog"
            aria-expanded={openImgPicker}
          >
            <FaImage size={14} />
          </button>

          <button
            type="button"
            className={`${featuresStyles.iconBtn} ${atLimit ? featuresStyles.iconBtnDisabled : ""}`}
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
              className={`${featuresStyles.iconBtn} ${featuresStyles.trashBtn}`}
              onClick={onDelete}
              title="מחק סקשן"
              aria-label="מחק סקשן"
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {templates[templateIndex]}

      {/* פופ־אפ ההתאמה */}
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
        initialQuery= {businessField}
        onPick={(url) => {
          setPickedImage(url);
          setOpenImgPicker(false);
        }}
        dir="rtl"
      />
    </section>
  );
}
