import React from "react";
import styles from "./Hero.module.css";
import Lottie from "lottie-react";
import animationData from "../../../../assets/Animation.json";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/forms");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.colLeft}>
          <h1 className={styles.title}>
            שיווק דיגיטלי מתקדם לעסקים
            <br />
            עם כוחה של&nbsp;בינה&nbsp;מלאכותית
          </h1>
          <button className={styles.primaryBtn} onClick={handleLogin}>התחל עכשיו</button>
        </div>

        <div className={styles.colRight}>
            <Lottie
              animationData={animationData}
              loop
              className={styles.animation}
            />
        </div>
      </div>
    </section>
  );
};

export default Hero;
