import React, { useEffect, useState } from "react";
import styles from "./Review.module.css";

interface Review {
  name: string;
  quote: string;
  avatar: string;
  rating: number;
}

const reviews: Review[] = [
  { name: "Alice",   quote: "הפלספירה הייתה הבחירה הכי טובה! התוצאות עקפו כל יעד, והצוות היה איתנו בכל שלב.", avatar: "https://i.pravatar.cc/140?img=1", rating: 5 },
  { name: "Bob",     quote: "אני משתמש בשירותי Smarketing לכל הקמפיינים – סיסטם אחד… שווה כל שקל.",              avatar: "https://i.pravatar.cc/140?img=2", rating: 5 },
  { name: "Charlie", quote: "לא האמנתי כמה מהר רואים תוצאות: תנועה והמרות גבוהות!",                                avatar: "https://i.pravatar.cc/140?img=3", rating: 5 },
  { name: "Dana",    quote: "התמיכה הטכנית והליווי האישי פשוט מדהימים.",                                             avatar: "https://i.pravatar.cc/140?img=4", rating: 5 },
  { name: "Eli",     quote: "דירוג SEO קפץ משמעותית תוך חודש!",                                                     avatar: "https://i.pravatar.cc/140?img=5", rating: 5 },
  { name: "Fiona",   quote: "UI מושלם, CTR מטורף – תענוג.",                                                          avatar: "https://i.pravatar.cc/140?img=6", rating: 5 },
  { name: "George",  quote: "שירותי PPC מדויקים ומקצועיים. שווים כל שקל.",                                           avatar: "https://i.pravatar.cc/140?img=7", rating: 5 },
];

const ReviewsSection: React.FC = () => {
  const [start, setStart] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStart(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const central = Array.from({ length: 3 }, (_, i) => reviews[(start + i) % reviews.length]);

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.staticRow}>
        {central.map((rev, idx) => (
          <div
            key={rev.name + start}    
            className={`${styles.card} ${idx === 1 ? styles.cardActive : ""}`}
          >
            <img src={rev.avatar} alt={rev.name} className={styles.avatar} />
            <h3>{rev.name}</h3>
            <p className={styles.quote}>{rev.quote}</p>
            <div className={styles.stars}>{"★".repeat(rev.rating)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
