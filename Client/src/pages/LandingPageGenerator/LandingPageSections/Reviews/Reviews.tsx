"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./reviews.module.css";
import {
  FaStar,
  FaStarHalfAlt,
  FaPalette,
  FaTrash,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import ReviewsLayoutPopUp, { ReviewsLayoutOptions } from "./ReviewsLayoutPopUp";

interface ReviewsProps {
  content: string[];
  onDelete?: () => void;
}

export default function Reviews({ content, onDelete }: ReviewsProps) {
  const [reviews, setReviews] = useState<string[]>([]);
  const [randomIndex, setRandomIndex] = useState<number | null>(null);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [popup, setPopup] = useState(false);
  const [useRealImages, setUseRealImages] = useState(false);
  const editBtn = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<ReviewsLayoutOptions>({
    templateIndex: 0,
    radius: 16,
    blur: 0,
    textAlign: "right",
    padding: "M",
  });

  useEffect(() => {
    const cleaned = content
      .slice(2, content.length - 3)
      .map((t) => t.replace(/['",]/g, "").trim());
    setReviews(cleaned);
  }, [content]);

  useEffect(() => {
    if (reviews.length) setRandomIndex(Math.floor(Math.random() * reviews.length));
  }, [reviews]);

  const addCard = () =>
    setReviews((p) => (p.length >= 6 ? p : [...p, "חוות דעת חדשה"]));

  const delCard = (i: number) =>
    setReviews((p) => p.filter((_, j) => j !== i));

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

  const stars = (i: number) =>
    i === randomIndex ? (
      <>
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStarHalfAlt />
      </>
    ) : (
      <>
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </>
    );

  const templates = [
    <div className={styles.gridContainer} key="grid">
      {reviews.map((txt, i) => (
        <div className={`${styles.reviewCardBase} ${styles.gridCard}`} key={i}>
          <button className={styles.closeCardBtn} onClick={() => delCard(i)}>
            ×
          </button>
          <img src={img(i)} className={styles.pic} alt="reviewer" />
          <p
            className={styles.reviewText}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              setReviews((p) => {
                const c = [...p];
                c[i] = e.currentTarget.innerText;
                return c;
              })
            }
          >
            {txt}
          </p>
          <div className={styles.stars}>{stars(i)}</div>
        </div>
      ))}
    </div>,

    <div className={styles.mediaContainer} key="media">
      {reviews.map((txt, i) => (
        <div className={`${styles.reviewCardBase} ${styles.mediaCard}`} key={i}>
          <button className={styles.closeCardBtn} onClick={() => delCard(i)}>
            ×
          </button>
          <img src={img(i)} className={styles.pic} alt="reviewer" />
          <div>
            <p
              className={styles.reviewText}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                setReviews((p) => {
                  const c = [...p];
                  c[i] = e.currentTarget.innerText;
                  return c;
                })
              }
            >
              {txt}
            </p>
            <div className={styles.stars}>{stars(i)}</div>
          </div>
        </div>
      ))}
    </div>,

    <div className={styles.stackedContainer} key="stacked">
      {reviews.map((txt, i) => (
        <div className={`${styles.reviewCardBase} ${styles.stackedCard}`} key={i}>
          <button className={styles.closeCardBtn} onClick={() => delCard(i)}>
            ×
          </button>
          <img src={img(i)} className={styles.pic} alt="reviewer" />
          <p
            className={styles.reviewText}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              setReviews((p) => {
                const c = [...p];
                c[i] = e.currentTarget.innerText;
                return c;
              })
            }
          >
            {txt}
          </p>
          <div className={styles.stars}>{stars(i)}</div>
        </div>
      ))}
    </div>,
  ];

  return (
    <section
      className={styles.reviewsSection}
      style={{
        borderRadius: opts.radius,
        backdropFilter: `blur(${opts.blur}px)`,
        textAlign: opts.textAlign,
        padding: opts.padding === "S" ? "24px" : opts.padding === "L" ? "64px" : "40px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className={styles.toolbar}>
          {reviews.length < 6 && (
            <button className={styles.iconBtn} onClick={addCard} title="הוסף כרטיס">
              <FaPlus size={14} />
            </button>
          )}
          <button
            className={styles.iconBtn}
            onClick={() => setUseRealImages((p) => !p)}
            title="החלף תמונות"
          >
            <FaUser size={14} />
          </button>
          <button
            ref={editBtn}
            className={styles.iconBtn}
            onClick={() => setPopup(true)}
            title="ערוך עיצוב"
          >
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button className={`${styles.iconBtn} ${styles.trashBtn}`} onClick={onDelete}>
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      <div className={styles.wrapper}>
        {templates[templateIndex]}
      </div>

      {popup && (
        <ReviewsLayoutPopUp
          open={popup}
          anchorRef={editBtn}
          options={opts}
          onClose={() => setPopup(false)}
          onChange={(next) => {
            setOpts(next);
            setTemplateIndex(next.templateIndex);
          }}
        />
      )}
    </section>
  );
}
