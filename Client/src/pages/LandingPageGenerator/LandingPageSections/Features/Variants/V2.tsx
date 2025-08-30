
"use client";
import React from "react";
import s from "../features.module.css";
import { FeatureItemEditable, TextHandlers, sideClass as side } from "../features.shared";

export type VProps = {
  services: string[];
  currentImage: string;
  opts: {
    textAlign: "right" | "left" | "center";
    imageSide: "left" | "right" | "top";
    gridCols: number;
  };
  handlers: TextHandlers;
  withIcons: boolean;
};

const V1: React.FC<VProps> = ({ services, currentImage, opts, handlers, withIcons }) => {
  return (
    <div className={`${s.twoColLayout} ${side(opts.imageSide)}`}>
      <img src={currentImage} className={s.featuresImage} alt="" />
      <ul className={s.featuresList} style={{ textAlign: opts.textAlign as any }}>
        {services.map((txt, i) => (
          <li key={i}>
            <FeatureItemEditable index={i} text={txt} handlers={handlers} withIcon={withIcons} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default V1;
