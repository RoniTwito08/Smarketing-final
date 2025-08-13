"use client";
import type { ServiceItem } from "../Services";
import s from "../services.module.css";

export default function V3({ items }: { items: ServiceItem[] }) {
  return (
    <div className={`${s.grid} ${s.v3Grid}`}>
      {items.map((it, i) => (
        <article key={i} className={`${s.card} ${s.cardGlass}`}>
          <h3 className={s.cardTitle}>{it.title}</h3>
          <p className={s.cardText}>{it.description}</p>
        </article>
      ))}
    </div>
  );
}
