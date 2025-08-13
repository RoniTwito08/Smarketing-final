"use client";
import React from "react";
import s from "../features.module.css";
import { FeatureItemEditable, TextHandlers } from "../features.shared";

export type VProps = {
  services: string[];
  currentImage: string;
  handlers: TextHandlers;
  withIcons: boolean;
};

const V3: React.FC<VProps> = ({ services, currentImage, handlers, withIcons }) => {
  return (
    <div className={s.fancyWrapper}>
      <div className={s.fancyHero}>
        <img src={currentImage} className={s.fancyImage} alt="" />
      </div>
      <div className={s.fancyCards}>
        {services.map((txt, i) => (
          <div
            key={i}
            className={s.fancyCard}
            style={{ ["--tilt" as any]: `${i % 2 === 0 ? -6 : 6}deg` }}
          >
            <FeatureItemEditable index={i} text={txt} handlers={handlers} withIcon={withIcons} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default V3;
