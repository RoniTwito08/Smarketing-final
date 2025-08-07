"use client";
import { useState, useRef } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import aboutUsStyles from "./aboutUs.module.css";
import AboutUsPopup, { AboutUsOptions } from "./AboutUsPopup";

interface Props {
  content: string;
  onDelete?: () => void;
}

export default function AboutUs({ content, onDelete }: Props) {
  const [text, setText] = useState(content);
  const [hovered, setHover] = useState(false);

  /* אפשרויות שמגיעות מה-Popup */
  const [opts, setOpts] = useState<AboutUsOptions>({
    template: 0,
    fontSize: "M",
    columns: "single",
    showStats: true,
  });

  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  /* מפות עזר */
  const fontMap = { S: "16px", M: "20px", L: "24px" } as const;
  const columnStyle =
    opts.columns === "double"
      ? { columnCount: 2 as const, columnGap: "32px" }
      : {};

  /* שינוי טקסט */
  const onBlur = (e: React.FocusEvent<HTMLParagraphElement>) =>
    setText(e.currentTarget.innerText);

  /* === תבניות === */
  const T1 = (
    <p
      contentEditable
      suppressContentEditableWarning
      onBlur={onBlur}
      style={{ fontSize: fontMap[opts.fontSize], ...columnStyle }}
      className={`${aboutUsStyles.aboutUsText} ${aboutUsStyles.template1}`}
    >
      {text}
    </p>
  );

  const T2 = (
    <p
      contentEditable
      suppressContentEditableWarning
      onBlur={onBlur}
      style={{ fontSize: fontMap[opts.fontSize], ...columnStyle }}
      className={`${aboutUsStyles.aboutUsText} ${aboutUsStyles.template2}`}
    >
      <strong>על הצוות שלנו:</strong>
      <br />
      {text}
    </p>
  );

  const T3 = (
    <p
      contentEditable
      suppressContentEditableWarning
      onBlur={onBlur}
      style={{ fontSize: fontMap[opts.fontSize], ...columnStyle }}
      className={`${aboutUsStyles.aboutUsText} ${aboutUsStyles.template3}`}
    >
      ✨ {text} ✨
    </p>
  );

  const templates = [T1, T2, T3];

  return (
    <section
      className={aboutUsStyles.aboutUsSection}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* TOOLBAR */}
      {hovered && (
        <div className={aboutUsStyles.toolbar}>
          <button
            ref={editBtnRef}
            className={aboutUsStyles.iconBtn}
            onClick={() => setOpenPop(true)}
            title="ערוך סקשן"
          >
            <FaPalette size={14} />
          </button>

          {onDelete && (
            <button
              className={`${aboutUsStyles.iconBtn} ${aboutUsStyles.trashBtn}`}
              onClick={onDelete}
              title="מחק סקשן"
            >
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {/* === תבנית נוכחית === */}
      {templates[opts.template]}

      {/* === כרטיסי סטטיסטיקה (אם נבחר) === */}
      {opts.showStats && (
        <div className={aboutUsStyles.statsRow}>
          <div className={aboutUsStyles.statCard}>
            <h3>1000+</h3>
            <span>פרויקטים</span>
          </div>
          <div className={aboutUsStyles.statCard}>
            <h3>250+</h3>
            <span>פעילים</span>
          </div>
          <div className={aboutUsStyles.statCard}>
            <h3>500+</h3>
            <span>לקוחות</span>
          </div>
        </div>
      )}

      {/* POP-UP */}
      <AboutUsPopup
        open={openPop}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenPop(false)}
        anchorRef={editBtnRef}
        dir="rtl"
      />
    </section>
  );
}
