"use client";
import React from "react";
import s from "../features.module.css";
import { FeatureItemEditable, TextHandlers } from "../features.shared";

export type VProps = {
  services: string[];
  currentImage: string;
  opts: {
    textAlign: "right" | "left" | "center";
    gridCols: number;
  };
  handlers: TextHandlers;
  withIcons: boolean;
};

const V2: React.FC<VProps> = ({ services, currentImage, opts, handlers, withIcons }) => {
  return (
    <div className={s.glassWrapper}>
      <img src={currentImage} className={s.glassImage} alt="" />
      <div
        className={s.glassGrid}
        style={{ gridTemplateColumns: `repeat(${opts.gridCols}, 1fr)`, textAlign: opts.textAlign as any }}
      >
        {services.map((txt, i) => (
          <div key={i} className={s.glassCard}>
            <FeatureItemEditable index={i} text={txt} handlers={handlers} withIcon={withIcons} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default V2;