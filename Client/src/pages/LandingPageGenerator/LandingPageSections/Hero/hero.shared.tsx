"use client";
import React from "react";
import s from "./hero.module.css";

export type TextState = { [k: string]: string };

export const inferDir = (str: string): "rtl" | "ltr" =>
  /[\u0590-\u05FF]/.test(str) ? "rtl" : "ltr";
const STRIP_BIDI = /[\u200E\u200F\u202A-\u202E]/g;
export const clean = (str: string) => str.replace(STRIP_BIDI, "");

export type TextHandlers = (id: string) => {
  onInput: (e: React.FormEvent<HTMLElement>) => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
};

export type BtnHandlers = (idx: number) => {
  onInput: (e: React.FormEvent<HTMLElement>) => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
};

export const EditableBlock: React.FC<{
  id: string;
  className: string;
  value: string;
  handlers: TextHandlers;
  as?: "h1" | "p" | "span";
  extra?: React.HTMLAttributes<HTMLElement>;
}> = ({ id, className, value, handlers, as = "p", extra }) => {
  const Tag: any = as;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      dir={inferDir(value)}
      className={`${className} ${s.editable}`}
      {...handlers(id)}
      {...extra}
    >
      {value}
    </Tag>
  );
};

export const ButtonsRow: React.FC<{
  items: string[];
  onRemove: (idx: number) => void;
  handlers: BtnHandlers;
  altStyle?: boolean;
}> = ({ items, onRemove, handlers, altStyle }) => (
  <div className={s.ctaRow}>
    {items.map((label, i) => (
      <span key={`wrap-${i}`} className={s.ctaWrap}>
        <div className={altStyle ? s.ctaAlt : s.cta} role="button" tabIndex={0} aria-label={label}>
          <span className={s.ctaGlow} aria-hidden />
          <button
            type="button"
            className={s.ctaRemoveIn}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(i);
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
            {...handlers(i)}
          >
            {label}
          </span>
        </div>
      </span>
    ))}
  </div>
);

export const defaults = {
  hero1:
    "https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=1200&auto=format&fit=crop",
  hero2:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  hero3:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1200&q=80",
  hero4:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1200&q=80",
  hero5:
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
  hero6:
    "https://images.unsplash.com/photo-1603484477859-abe6a73f9365?auto=format&fit=crop&w=1200&q=80",
  hero7:
    "https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=1600&q=80",
};
