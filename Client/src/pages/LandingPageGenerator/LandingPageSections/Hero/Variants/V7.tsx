"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V7: React.FC<VProps> = ({ textValues, buttons, heroVars, bgImage, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero7} style={heroVars} aria-label="Hero – Split Panel Over BG">
    <img src={bgImage || ""} alt="" className={s.hero7Img} loading="lazy" draggable={false} />
    <div className={s.hero7Panel}>
      <EditableBlock id="1" className={s.hero7Title} value={textValues["1"]} handlers={textHandlers} as="h1" />
      <EditableBlock id="2" className={s.hero7Text} value={textValues["2"]} handlers={textHandlers} />
      <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} />
    </div>
  </section>
);

export default V7;
