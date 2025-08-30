"use client";
import React from "react";
import s from "../hero.module.css";
import { ButtonsRow, EditableBlock } from "../hero.shared";
import { VProps } from "./V1";

const V2: React.FC<VProps> = ({ textValues, buttons, bgImage, heroVars, textHandlers, btnHandlers, removeAt }) => (
  <section className={s.hero1} style={heroVars} aria-label="Hero – Split Text & Image">
      <div>
        <EditableBlock id="1" className={s.title} value={textValues["1"]} handlers={textHandlers} as="h1" />
        <EditableBlock id="2" className={s.text} value={textValues["2"]} handlers={textHandlers} />
        <ButtonsRow items={buttons} onRemove={removeAt} handlers={btnHandlers} />
      </div>

      <img
        src={bgImage || ""}
        alt=""
        className={s.hero1Img}
        loading="lazy"
        draggable={false}
      />
    </section>
);

export default V2;

