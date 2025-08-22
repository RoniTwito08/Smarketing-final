"use client";
import React, { useEffect, useState } from "react";
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

/** שורת כפתורים עם עריכת טקסט (קיים) + עורך קישור (⋯) חדש */
export const ButtonsRow: React.FC<{
  items: string[];
  onRemove: (idx: number) => void;
  handlers: BtnHandlers;
  altStyle?: boolean;
}> = ({ items, onRemove, handlers, altStyle }) => {
  // href לכל כפתור (ברירת מחדל "#")
  const [links, setLinks] = useState<string[]>(() => items.map(() => "#"));
  // איזה פופאובר קישור פתוח
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // סנכרון אורך המערך כשהכפתורים משתנים
  useEffect(() => {
    setLinks(prev => {
      const next = [...prev];
      if (items.length > prev.length) {
        return [...next, ...Array(items.length - prev.length).fill("#")];
      }
      return next.slice(0, items.length);
    });
  }, [items.length]);

  const setLinkAt = (i: number, href: string) => {
    setLinks(prev => {
      const next = [...prev];
      next[i] = normalizeHref(href);
      return next;
    });
  };

  return (
    <div className={s.ctaRow}>
      {items.map((label, i) => {
        const h = handlers(i) || {};
        const href = links[i] || "#";
        const isOpen = openIdx === i;

        return (
          <span key={`wrap-${i}`} className={s.ctaWrap} style={{ display: "inline-flex", alignItems: "center", gap: 6, position: "relative" }}>
            {/* הכפתור עצמו כקישור עם href דינמי; הטקסט נשאר contentEditable */}
            <a
              href={href}
              className={altStyle ? s.ctaAlt : s.cta}
              onMouseDown={(e) => {
                // מונע פוקוס לא רצוי כשעורכים את הטקסט
                if ((e.target as HTMLElement).closest("button")) e.preventDefault();
              }}
              style={{ textDecoration: "none" }}
            >
              <span className={s.ctaGlow} aria-hidden />
              <span
                contentEditable
                suppressContentEditableWarning
                dir={inferDir(label)}
                className={`${s.editable} ${s.editableInline}`}
                {...h}
                onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
              >
                {label}
              </span>
            </a>

            {/* כפתור ⋯ – עורך קישור */}
            <button
              className={s.ctaEditLink}
              type="button"
              aria-label="עריכת קישור"
              title="הגדרת קישור"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenIdx(isOpen ? null : i); }}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid var(--border, #E5E7EB)",
                background: "var(--bg, #fff)", cursor: "pointer"
              }}
            >
              ⋯
            </button>

            {/* כפתור מחיקה (כמו שהיה) */}
            <button
              type="button"
              className={s.ctaRemoveIn}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(i); }}
              aria-label="מחק כפתור"
              title="מחק"
            >
              ×
            </button>

            {/* פופאובר הזנת הקישור */}
            {isOpen && (
              <div
                role="dialog"
                aria-label="עריכת קישור לכפתור"
                style={{
                  position: "absolute",
                  zIndex: 30,
                  top: "110%",
                  insetInlineStart: 0,
                  padding: 10,
                  background: "#fff",
                  border: "1px solid var(--border, #E5E7EB)",
                  borderRadius: 10,
                  boxShadow: "0 6px 24px rgba(0,0,0,.08)",
                  minWidth: 260,
                  display: "grid",
                  gap: 8,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <label style={{ fontSize: 12, opacity: 0.75 }}>קישור לכפתור</label>
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com"
                  defaultValue={href === "#" ? "" : href}
                  onChange={(e) => setLinkAt(i, e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") setOpenIdx(null);
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid var(--border, #E5E7EB)",
                    font: "inherit",
                    direction: "ltr",
                  }}
                />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(null)}
                    style={{
                      padding: "6px 10px", borderRadius: 8,
                      border: "1px solid var(--border, #E5E7EB)", background: "#fff", cursor: "pointer"
                    }}
                  >
                    סגור
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(null)}
                    style={{
                      padding: "6px 10px", borderRadius: 8,
                      background: "var(--primary, #111827)", color: "#fff",
                      border: "none", cursor: "pointer"
                    }}
                  >
                    שמירה
                  </button>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, direction: "ltr", overflowWrap: "anywhere" }}>
                  {links[i] || "#"}
                </div>
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
};

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

/** נרמול קישור: אם נכתב דומיין בלי פרוטוקול – נוסיף https:// ; תומך גם mailto/tel */
function normalizeHref(href: string): string {
  const v = (href || "").trim();
  if (!v) return "#";
  if (/^[a-z]+:\/\//i.test(v)) return v;      // יש פרוטוקול
  if (/^(mailto:|tel:)/i.test(v)) return v;   // mailto/tel
  if (/^[\w.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(v)) return "https://" + v;
  return v;
}
