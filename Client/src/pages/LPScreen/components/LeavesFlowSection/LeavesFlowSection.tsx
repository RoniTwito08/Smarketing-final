import React from "react";
import styles from "./LeavesFlowSection.module.css";

const LeavesFlowSection: React.FC = () => {
  return (
    <section className={styles.flowWrapper}>
      {/* ➊ הרשמה ומילוי פרטים */}
      <div className={styles.leaf}>
        <span className={styles.emoji} role="img" aria-label="רישום">
          📝
        </span>
        <span className={styles.text}>
          הרשמה<br />ומילוי פרטים
        </span>
      </div>

      {/* חץ מעבר */}
      <svg
        className={styles.arrow}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 12H20M4 12L8 8M4 12L8 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ➋ בניית דפי נחיתה */}
      <div className={styles.leaf}>
        <span className={styles.emoji} role="img" aria-label="דפי נחיתה">
          🌐
        </span>
        <span className={styles.text}>
          בניית<br />דפי&nbsp;נחיתה
        </span>
      </div>

      <svg
        className={styles.arrow}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 12H20M4 12L8 8M4 12L8 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ➌ שיווק אגרסיבי בגוגל */}
      <div className={styles.leaf}>
        <span className={styles.emoji} role="img" aria-label="שיווק בגוגל">
          🔥
        </span>
        <span className={styles.text}>
          שיווק<br />אגרסיבי<br />ב-Google
        </span>
      </div>

      <svg
        className={styles.arrow}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 12H20M4 12L8 8M4 12L8 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ➍ מעקב לידים */}
      <div className={styles.leaf}>
        <span className={styles.emoji} role="img" aria-label="מעקב לידים">
          📊
        </span>
        <span className={styles.text}>
          מעקב<br />לידים
        </span>
      </div>

      <svg
        className={styles.arrow}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 12H20M4 12L8 8M4 12L8 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ➎ לקוחות חדשים */}
      <div className={styles.leaf}>
        <span className={styles.emoji} role="img" aria-label="לקוחות חדשים">
          🤝
        </span>
        <span className={styles.text}>
          לקוחות<br />חדשים
        </span>
      </div>
    </section>
  );
};

export default LeavesFlowSection;
