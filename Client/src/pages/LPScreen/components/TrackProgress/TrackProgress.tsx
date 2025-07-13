import React, { ReactNode } from "react";
import styles from "./TrackProgress.module.css";

interface Props {
  section?: string;
  mainImgSrc: string;
  accentImgSrc: string;
  title?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  imagePosition?: "left" | "right";
  children?: ReactNode;
}

const TrackProgressSection: React.FC<Props> = ({
  section,
  mainImgSrc,
  accentImgSrc,
  title,
  description,
  ctaText,
  onCtaClick,
  imagePosition = "right",
  children,
}) => (
  <section
    className={`${styles.section} ${
      imagePosition === "left" ? styles.reverse : ""
    }`}
  >
    <div className={styles.media}>
      <img src={mainImgSrc} alt="" className={styles.mainImg} />
      <span className={styles.label}>{section}</span>

      <img
        src={accentImgSrc}
        alt=""
        className={`${styles.accentImg} ${
          imagePosition === "right" ? styles.accentLeft : ""
        }`}
      />
    </div>

    <div className={styles.content}>
      {title && <h2 className={styles.title}>{title}</h2>}

      {description && <p className={styles.desc}>{description}</p>}

      {children}

      {ctaText && (
        <button className={styles.cta} onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  </section>
);

export default TrackProgressSection;
