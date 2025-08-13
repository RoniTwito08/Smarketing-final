"use client";
import type { ServiceItem } from "../Services";
import s from "../services.module.css";
import { FaCheckCircle } from "react-icons/fa";

export default function V1({ items, showIcons = true }: { items: ServiceItem[]; showIcons?: boolean }) {
  return (
    <div className={`${s.grid} ${s.v1Grid}`}>
      {items.map((it, i) => (
        <article key={i} className={`${s.card} ${s.cardNeon}`}>
          <div className={s.cardHead}>
            {showIcons && <FaCheckCircle className={s.cardIcon} />}
            <h3 className={s.cardTitle}>{it.title}</h3>
          </div>
          <p className={s.cardText}>{it.description}</p>
        </article>
      ))}
    </div>
  );
}
