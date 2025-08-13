"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V3: React.FC<VProps> = ({ textValues, buttons, heroVars, bgImage, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero3} style={heroVars} aria-label="Hero – Text + Circular Image">
    <div>
      <EditableBlock id="1" className={s.hero3Title} value={textValues["1"]} handlers={textHandlers} as="h1" />
      <EditableBlock id="2" className={s.hero3Text} value={textValues["2"]} handlers={textHandlers} />
      <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} />
    </div>

    <figure className={s.hero3Fig}>
      <img src={bgImage || ""} alt="" loading="lazy" draggable={false} />
    </figure>
  </section>
);

export default V3;
