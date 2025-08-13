"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V2: React.FC<VProps> = ({ textValues, buttons, heroVars, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero2} style={heroVars} aria-label="Hero – Centered BG">
    <EditableBlock id="1" className={s.hero2Title} value={textValues["1"]} handlers={textHandlers} as="h1" />
    <EditableBlock id="2" className={s.text} value={textValues["2"]} handlers={textHandlers} />
    <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} />
  </section>
);

export default V2;
