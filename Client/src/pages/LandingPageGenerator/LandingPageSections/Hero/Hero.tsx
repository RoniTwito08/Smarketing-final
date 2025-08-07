"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaPalette, FaPlus, FaImage} from "react-icons/fa";
import s from "./hero.module.css";
import LayoutPopUp, { LayoutOptions } from "./LayoutPopUp/LayoutPopUp";
import BackgroundPickerPopUp from "./backgroundPickerPopUp/backgroundPickerPopUp";
import choosePhoto from "../../../../assets/choosePhoto.png" 

interface HeroProps {
  title: string;
  content: string;
  buttonText: string;
}

const inferDir = (str: string): "rtl" | "ltr" =>
  /[\u0590-\u05FF]/.test(str) ? "rtl" : "ltr";
const STRIP_BIDI = /[\u200E\u200F\u202A-\u202E]/g;
const clean = (str: string) => str.replace(STRIP_BIDI, "");

const defaults = {
  hero1: choosePhoto,
  hero2:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  hero3:
    choosePhoto,
  hero4:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80",
  hero5:
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
  hero6:
    choosePhoto,
  hero7:
    choosePhoto,
};

export default function Hero({ title, content, buttonText }: HeroProps) {
  const [textValues, setTextValues] = useState<{ [k: string]: string }>({
    "1": title,
    "2": content,
    "3": buttonText,
  });
  const [btns, setBtns] = useState<string[]>([buttonText || "Get started"]);

  const [templateIndex, setTemplateIndex] = useState(0);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [openEditor, setOpenEditor] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [openBgPicker, setOpenBgPicker] = useState(false);
  const imgBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<LayoutOptions>({
    fullBleed: true,
    align: "center",
    cardWidth: "L",
    textAlign: "right",
    radius: 20,
    blur: 6,
    padding: "L",
  });

  useEffect(() => {
    setTextValues({ "1": title, "2": content, "3": buttonText });
    setBtns([buttonText || "Get started"]);
  }, [title, content, buttonText]);

  const composingRef = useRef(false);

  const genTextHandlers = (id: string) => ({
    onInput: (e: React.FormEvent<HTMLElement>) => {
      const ev = e.nativeEvent as InputEvent;
      if ((ev as any).isComposing || composingRef.current) return;
      const el = e.currentTarget as HTMLElement;
      const val = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(val));
    },
    onCompositionEnd: (e: React.CompositionEvent<HTMLElement>) => {
      composingRef.current = false;
      const el = e.currentTarget as HTMLElement;
      const val = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(val));
      setTextValues((p) => ({ ...p, [id]: val }));
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      const val = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(val));
      setTextValues((p) => ({ ...p, [id]: val }));
    },
  });

  const genBtnHandlers = (i: number) => ({
    onInput: (e: React.FormEvent<HTMLElement>) => {
      const ev = e.nativeEvent as InputEvent;
      if ((ev as any).isComposing || composingRef.current) return;
      const el = e.currentTarget as HTMLElement;
      el.setAttribute("dir", inferDir(el.textContent ?? ""));
    },
    onCompositionEnd: (e: React.CompositionEvent<HTMLElement>) => {
      composingRef.current = false;
      const el = e.currentTarget as HTMLElement;
      const val = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(val));
      setBtns((prev) => prev.map((b, idx) => (idx === i ? val : b)));
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      const val = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(val));
      setBtns((prev) => prev.map((b, idx) => (idx === i ? val : b)));
    },
  });

  const addButton = () => setBtns((prev) => [...prev, `כפתור ${prev.length + 1}`]);
  const removeAt = (idx: number) => setBtns((prev) => prev.filter((_, i) => i !== idx));

  const heroVars = useMemo<React.CSSProperties>(() => {
    const padY = opts.padding === "S" ? "56px" : opts.padding === "M" ? "80px" : "120px";
    const padX = opts.padding === "S" ? "16px" : opts.padding === "M" ? "24px" : "32px";
    return {
      ["--hero-radius" as any]: `${opts.radius}px`,
      ["--panel-blur" as any]: `${opts.blur}px`,
      ["--pad-y" as any]: padY,
      ["--pad-x" as any]: padX,
      ["--text-align" as any]: opts.textAlign,
      ["--hero-image" as any]: bgImage ? `url("${bgImage}")` : "none",
    };
  }, [opts, bgImage]);

  const renderButtons = (alt = false) => (
    <>
      <div className={s.ctaRow}>
        {btns.map((label, i) => (
          <span key={`wrap-${i}`} className={s.ctaWrap}>
            <div className={alt ? s.ctaAlt : s.cta} role="button" tabIndex={0} aria-label={label}>
              <span className={s.ctaGlow} aria-hidden />
              <button
                type="button"
                className={s.ctaRemoveIn}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeAt(i);
                }}
                aria-label="מחק כפתור"
                title="מחק"
              >
                ×
              </button>
              <span
                contentEditable
                suppressContentEditableWarning
                dir={inferDir(label)}
                className={`${s.editable} ${s.editableInline}`}
                {...genBtnHandlers(i)}
              >
                {label}
              </span>
            </div>
          </span>
        ))}
      </div>
    </>
  );

  const templates = [
    <>
      <section
        key="t1"
        className={s.hero1}
        style={heroVars}
        aria-label="Job search hero"
      >
        <div>
          <h1
            contentEditable
            suppressContentEditableWarning
            dir={inferDir(textValues["1"])}
            className={`${s.title} ${s.editable}`}
            {...genTextHandlers("1")}
          >
            {textValues["1"]}
          </h1>

          <p
            contentEditable
            suppressContentEditableWarning
            dir={inferDir(textValues["2"])}
            className={`${s.text} ${s.editable}`}
            {...genTextHandlers("2")}
          >
            {textValues["2"]}
          </p>

          {renderButtons()}
        </div>

        <img
          src={bgImage || defaults.hero1}
          alt=""
          className={s.hero1Img}
          loading="lazy"
          draggable={false}
        />
      </section>

    </>,

    <>
      <section
        key="t2"
        className={s.hero2}
        style={heroVars}
      >
        <h1
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["1"])}
          className={`${s.hero2Title} ${s.editable}`}
          {...genTextHandlers("1")}
        >
          {textValues["1"]}
        </h1>

        <p
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["2"])}
          className={`${s.text} ${s.editable}`}
          {...genTextHandlers("2")}
        >
          {textValues["2"]}
        </p>

        {renderButtons()}
      </section>
    </>,

    <section
      key="t3"
      className={s.hero3}
      style={heroVars}
      aria-label="Shift business hero"
    >
      <div>
        <h1
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["1"])}
          className={`${s.hero3Title} ${s.editable}`}
          {...genTextHandlers("1")}
        >
          {textValues["1"]}
        </h1>

        <p
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["2"])}
          className={`${s.hero3Text} ${s.editable}`}
          {...genTextHandlers("2")}
        >
          {textValues["2"]}
        </p>

        {renderButtons()}
      </div>

      <figure className={s.hero3Fig}>
        <img
          src={bgImage || defaults.hero4}
          alt=""
          loading="lazy"
          draggable={false}
        />
      </figure>
    </section>,

    <section
      key="t4"
      className={s.hero4}
      style={heroVars}
      aria-label="Minimal interior hero"
    >
      <p
        contentEditable
        suppressContentEditableWarning
        dir={inferDir(textValues["2"])}
        className={`${s.hero4Text} ${s.editable}`}
        {...genTextHandlers("2")}
      >
        {textValues["2"]}
      </p>

      <h1
        contentEditable
        suppressContentEditableWarning
        dir={inferDir(textValues["1"])}
        className={`${s.hero4Title} ${s.editable}`}
        {...genTextHandlers("1")}
      >
        {textValues["1"]}
      </h1>

      {renderButtons(true)}
    </section>,

    <section
      key="t5"
      className={s.hero5}
      style={heroVars}
      aria-label="Consulting hero"
    >
      <div className={s.hero5Inner}>
        <h1
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["1"])}
          className={`${s.hero5Title} ${s.editable}`}
          {...genTextHandlers("1")}
        >
          {textValues["1"]}
        </h1>

        <p
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["2"])}
          className={`${s.hero5Text} ${s.editable}`}
          {...genTextHandlers("2")}
        >
          {textValues["2"]}
        </p>

        {renderButtons(true)}
      </div>
    </section>,

    <section
      key="t6"
      className={s.hero6}
      style={heroVars}
      aria-label="Product spotlight hero"
    >
      <img
        src={bgImage || defaults.hero7}
        alt=""
        className={s.hero6Img}
        loading="lazy"
        draggable={false}
      />

      <span
        contentEditable
        suppressContentEditableWarning
        dir={inferDir(textValues["tag"])}
        className={`${s.hero6Tag} ${s.editable}`}
        {...genTextHandlers("tag")}
      >
        {textValues["tag"]}
      </span>

      <h1
        contentEditable
        suppressContentEditableWarning
        dir={inferDir(textValues["1"])}
        className={`${s.hero6Title} ${s.editable}`}
        {...genTextHandlers("1")}
      >
        {textValues["1"]}
      </h1>

      <p
        contentEditable
        suppressContentEditableWarning
        dir={inferDir(textValues["2"])}
        className={`${s.hero6Text} ${s.editable}`}
        {...genTextHandlers("2")}
      >
        {textValues["2"]}
      </p>

      {renderButtons(true)}
    </section>,

    <section
      key="t7"
      className={s.hero7}
      style={heroVars}
      aria-label="Workspace comfort hero"
    >
      <img
        src={bgImage || defaults.hero1}
        alt=""
        className={s.hero7Img}
        loading="lazy"
        draggable={false}
      />

      <div className={s.hero7Panel}>

        <h1
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["1"])}
          className={`${s.hero7Title} ${s.editable}`}
          {...genTextHandlers("1")}
        >
          {textValues["1"]}
        </h1>

        <p
          contentEditable
          suppressContentEditableWarning
          dir={inferDir(textValues["2"])}
          className={`${s.hero7Text} ${s.editable}`}
          {...genTextHandlers("2")}
        >
          {textValues["2"]}
        </p>

        {renderButtons()}
      </div>
    </section>
  ];

  return (
    <div className={s.wrap}>
      <div className={s.toolbar}>
        <button
          ref={editBtnRef}
          type="button"
          className={s.editBtn}
          onClick={() => setOpenEditor(v => !v)}
          aria-haspopup="dialog"
          aria-expanded={openEditor}
          title="התאמה"
        >
          <FaPalette size={14}/>
        </button>

        <button
          ref={imgBtnRef}
          type="button"
          className={s.editBtn}
          onClick={() => setOpenBgPicker(true)}
          aria-haspopup="dialog"
          aria-expanded={openBgPicker}
          title="בחר תמונת רקע"
          style={{ marginInlineStart: 8 }}
        >
          <FaImage size={14}/>
        </button>

        <button
          type="button"
          className={s.editBtn}
          onClick={addButton}
          title="הוסף כפתור CTA"
          aria-label="הוסף כפתור"
          style={{ marginInlineStart: 8 }}
        >
          <FaPlus size={14}/>
        </button>
      </div>


      {templates[templateIndex]}

      <LayoutPopUp
        open={openEditor}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenEditor(false)}
        onPickTemplate={setTemplateIndex}
        activeTemplate={templateIndex}
        anchorRef={editBtnRef}
        dir="rtl"
      />

      <BackgroundPickerPopUp
        open={openBgPicker}
        onClose={() => setOpenBgPicker(false)}
        anchorRef={imgBtnRef}
        onPick={(url) => {
          setBgImage(url);
          setOpenBgPicker(false);
        }}
        initialQuery="abstract gradient"
      />
    </div>
  );
}
