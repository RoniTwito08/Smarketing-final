"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaPalette, FaPlus, FaImage } from "react-icons/fa";
import s from "./hero.module.css";
import LayoutPopUp, { LayoutOptions } from "./LayoutPopUp/LayoutPopUp";
import BackgroundPickerPopUp from "./backgroundPickerPopUp/backgroundPickerPopUp";
import { clean, inferDir, defaults } from "./hero.shared";

// Variants
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";
import V4 from "./Variants/V4";
import V5 from "./Variants/V5";
import V6 from "./Variants/V6";
import V7 from "./Variants/V7";

interface HeroProps {
  title: string;
  content: string;
  buttonText: string;
  initialVariant?: number; // 0..6
  initialBg?: string | null;
}

const VARIANTS = [V1, V2, V3, V4, V5, V6, V7];

export default function Hero({
  title,
  content,
  buttonText,
  initialVariant = 0,
  initialBg = null,
}: HeroProps) {
  const [textValues, setTextValues] = useState<{ [k: string]: string }>({
    "1": title,
    "2": content,
    "3": buttonText,
    tag: "NEW",
  });
  const [buttons, setButtons] = useState<string[]>([buttonText || "Get started"]);

  const [templateIndex, setTemplateIndex] = useState(initialVariant);
  const [bgImage, setBgImage] = useState<string | null>(initialBg || defaults.hero2);

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
    setTextValues({ "1": title, "2": content, "3": buttonText, tag: "NEW" });
    setButtons([buttonText || "Get started"]);
  }, [title, content, buttonText]);

  const composingRef = useRef(false);

  const textHandlers = (id: string) => ({
    onInput: (e: React.FormEvent<HTMLElement>) => {
      const ev = e.nativeEvent as InputEvent;
      if ((ev as any).isComposing || composingRef.current) return;
      const el = e.currentTarget as HTMLElement;
      const v = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(v));
    },
    onCompositionEnd: (e: React.CompositionEvent<HTMLElement>) => {
      composingRef.current = false;
      const el = e.currentTarget as HTMLElement;
      const v = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(v));
      setTextValues((p) => ({ ...p, [id]: v }));
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      const v = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(v));
      setTextValues((p) => ({ ...p, [id]: v }));
    },
  });

  const btnHandlers = (i: number) => ({
    onInput: (e: React.FormEvent<HTMLElement>) => {
      const ev = e.nativeEvent as InputEvent;
      if ((ev as any).isComposing || composingRef.current) return;
      const el = e.currentTarget as HTMLElement;
      el.setAttribute("dir", inferDir(el.textContent ?? ""));
    },
    onCompositionEnd: (e: React.CompositionEvent<HTMLElement>) => {
      composingRef.current = false;
      const el = e.currentTarget as HTMLElement;
      const v = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(v));
      setButtons((prev) => prev.map((b, idx) => (idx === i ? v : b)));
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      const v = clean(el.textContent ?? "");
      el.setAttribute("dir", inferDir(v));
      setButtons((prev) => prev.map((b, idx) => (idx === i ? v : b)));
    },
  });

  const addButton = () => setButtons((prev) => [...prev, `כפתור ${prev.length + 1}`]);
  const removeAt = (idx: number) => setButtons((prev) => prev.filter((_, i) => i !== idx));

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

  const ActiveVariant = VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, templateIndex))];

  return (
    <div className={s.wrap}>
      {/* Toolbar */}
      <div className={s.toolbar}>
        <button
          ref={editBtnRef}
          type="button"
          className={s.editBtn}
          onClick={() => setOpenEditor((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={openEditor}
          title="התאמה"
        >
          <FaPalette size={14} />
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
          <FaImage size={14} />
        </button>

        <button
          type="button"
          className={s.editBtn}
          onClick={addButton}
          title="הוסף כפתור CTA"
          aria-label="הוסף כפתור"
          style={{ marginInlineStart: 8 }}
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* Variant */}
      <ActiveVariant
        textValues={textValues}
        buttons={buttons}
        heroVars={heroVars}
        bgImage={bgImage || undefined}
        textHandlers={textHandlers}
        btnHandlers={btnHandlers}
        removeAt={removeAt}
      />

      {/* Editors */}
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
