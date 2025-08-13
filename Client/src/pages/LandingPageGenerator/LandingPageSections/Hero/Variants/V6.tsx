"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V6: React.FC<VProps> = ({ textValues, buttons, heroVars, bgImage, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero6} style={heroVars} aria-label="Hero – Product Spotlight">
    <img src={bgImage || ""} alt="" className={s.hero6Img} loading="lazy" draggable={false} />
    <EditableBlock id="1" className={s.hero6Title} value={textValues["1"]} handlers={textHandlers} as="h1" />
    <EditableBlock id="2" className={s.hero6Text} value={textValues["2"]} handlers={textHandlers} />
    <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} altStyle />
  </section>
);

export default V6;
