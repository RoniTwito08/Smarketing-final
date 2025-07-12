import React, { useState } from "react";
import styles from "./QA.module.css";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: "איך אפשר ליצור קשר עם צוות Smarketing?",
    a: "ניתן למלא את טופס ‘צור קשר’ באתר או לשלוח מייל אל info@smarketing.com – אנחנו חוזרים תוך 24 שעות.",
  },
  {
    q: "אילו שירותים אתם מציעים?",
    a: "אנחנו מספקים בניית דפי נחיתה, ניהול קמפיינים, SEO, אוטומציות שיווק ועוד.",
  },
  {
    q: "האם אתם מציעים שירות תחזוקה שוטף לאתרים?",
    a: "בהחלט! יש לנו חבילות תחזוקה חודשיות הכוללות גיבויים, עדכוני אבטחה ותמיכה בתקלות.",
  },
  {
    q: "כמה זמן לוקח לתכנן ולפתח אתר?",
    a: "בדרך-כלל 2–4 שבועות לפרויקט בסיסי, תלוי בדרישות ובמורכבות.",
  },
  {
    q: "האם צריך מקדמה לפני תחילת הפרויקט?",
    a: "כן, אנו גובים 30 % מקדמה כדי לשריין זמן פיתוח בלו״ז שלנו.",
  },
];

const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.leftCol}>
        {faqs.map((item, idx) => {
          const isOpen = idx === openIdx;
          return (
            <div
              key={idx}
              className={`${styles.item} ${isOpen ? styles.open : ""}`}
            >
              <button
                className={styles.questionRow}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  {isOpen ? (
                    <path d="M18 15.59 16.59 17 12 12.41 7.41 17 6 15.59 12 9.59l6 6z" />
                  ) : (
                    <path d="M19 13H5v-2h14v2z" />
                  )}
                </svg>
              </button>
              {isOpen && <p className={styles.answer}>{item.a}</p>}
            </div>
          );
        })}
      </div>

      <div className={styles.rightCol}>
        <img src="/src/assets/spiral.png" alt="" className={styles.spiral} />

        <h2 className={styles.title}>
          שאלות
          <br />
          נפוצות
        </h2>
      </div>
    </section>
  );
};

export default FAQSection;
