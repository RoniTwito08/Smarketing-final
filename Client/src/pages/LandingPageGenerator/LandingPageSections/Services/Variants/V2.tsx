"use client";
import type { ServiceItem } from "../Services";
import s from "../services.module.css";

export default function V2({ items }: { items: ServiceItem[] }) {
  return (
    <div className={`${s.grid} ${s.v2Grid}`}>
      {items.map((it, i) => (
        <article key={i} className={`${s.card} ${s.cardPaper}`}>
          <div className={s.ribbon}>חדש</div>
          <h3 className={s.cardTitle}>{it.title}</h3>
          <p className={s.cardText}>{it.description}</p>
        </article>
      ))}
    </div>
  );
}
