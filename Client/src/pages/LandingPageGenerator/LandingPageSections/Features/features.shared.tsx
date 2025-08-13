"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import s from "./features.module.css";

export type TextHandlers = (i: number) => {
  onBlur: (e: React.FocusEvent<HTMLSpanElement>) => void;
};

export const FeatureItemEditable: React.FC<{
  index: number;
  text: string;
  handlers: TextHandlers;
  withIcon?: boolean;
}> = ({ index, text, handlers, withIcon }) => {
  return (
    <div className={s.featureItem}>
      {withIcon ? <FaCheckCircle /> : null}
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handlers(index).onBlur(e)}
        className={s.featureText}
      >
        {text}
      </span>
    </div>
  );
};

// כלי עזר לקלאסים כיווניות/פריסות
export const sideClass = (imageSide: "left" | "right" | "top"): string => {
  if (imageSide === "right") return s.rowReverse;
  if (imageSide === "top") return s.column;
  return "";
};
