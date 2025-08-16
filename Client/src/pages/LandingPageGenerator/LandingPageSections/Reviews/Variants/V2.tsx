// src/components/LandingPageSections/Reviews/Variants/V2.tsx
"use client";
import s from "../reviews.module.css";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function V2({
  items,
  randomIndex,
  useRealImages,
  onDeleteCard,
  onChangeText,
  showStars,
}: {
  items: string[];
  randomIndex: number | null;
  useRealImages: boolean;
  onDeleteCard: (i: number) => void;
  onChangeText: (i: number, txt: string) => void;
  showStars: boolean;
}) {
  const img = (i: number) =>
    useRealImages
      ? [
          "/src/assets/TM1.jpeg",
          "/src/assets/TM2.jpeg",
          "/src/assets/TM3.jpg",
          "/src/assets/TW1.jpeg",
          "/src/assets/TW2.jpeg",
          "/src/assets/TW3.jpeg",
        ][i % 6]
      : i % 2 === 0
      ? "/src/assets/menReviewer.png"
      : "/src/assets/womenReviewer.png";

  const Stars = ({ i }: { i: number }) =>
    !showStars ? null : i === randomIndex ? (
      <>
        <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
      </>
    ) : (
      <>
        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
      </>
    );

  return (
    <div className={s.mediaContainer}>
      {items.map((txt, i) => (
        <div className={`${s.reviewCardBase} ${s.mediaCard}`} key={i}>
          <button className={s.closeCardBtn} onClick={() => onDeleteCard(i)} aria-label="מחיקת כרטיס">×</button>
          <img src={img(i)} className={s.pic} alt="מבקר" loading="lazy" />
          <div>
            <p
              className={s.reviewText}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onChangeText(i, e.currentTarget.innerText.trim())}
              dir="rtl"
            >
              {txt}
            </p>
            <div className={s.stars}><Stars i={i} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
