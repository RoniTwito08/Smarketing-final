"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V5: React.FC<VProps> = ({ textValues, buttons, heroVars, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero5} style={heroVars} aria-label="Hero – Left Gradient Panel">
    <div className={s.hero5Inner}>
      <EditableBlock id="1" className={s.hero5Title} value={textValues["1"]} handlers={textHandlers} as="h1" />
      <EditableBlock id="2" className={s.hero5Text} value={textValues["2"]} handlers={textHandlers} />
      <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} altStyle />
    </div>
  </section>
);

export default V5;
