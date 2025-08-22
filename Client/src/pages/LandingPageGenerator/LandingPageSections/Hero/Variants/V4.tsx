"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V4: React.FC<VProps> = ({ textValues, buttons, heroVars, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero4} style={heroVars} aria-label="Hero – Cinematic BG">
    <EditableBlock id="2" className={s.hero4Text} value={textValues["2"]} handlers={textHandlers} />
    <EditableBlock id="1" className={s.hero4Title} value={textValues["1"]} handlers={textHandlers} as="h1" />
    <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} altStyle />
  </section>
);

export default V4;
