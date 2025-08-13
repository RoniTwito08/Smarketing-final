"use client";
import type { ServiceItem } from "../Services";
import s from "../services.module.css";

export default function V4({ items }: { items: ServiceItem[] }) {
  return (
    <div className={`${s.grid} ${s.v4Grid}`}>
      {items.map((it, i) => (
        <article key={i} className={`${s.card} ${s.cardSplit}`}>
          <div className={s.cardSplitA}/>
          <div className={s.cardSplitB}>
            <h3 className={s.cardTitle}>{it.title}</h3>
            <p className={s.cardText}>{it.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
