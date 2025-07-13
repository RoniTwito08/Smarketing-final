import React, { useState } from "react";
import LoginForm from "../LoginForm/Login";
import RegisterForm from "../RegisterForm/Register";
import styles from "./LoginSignupPage.module.css";
import { useNavigate } from "react-router-dom";

const FormsPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.formsPageWrapper}>
      {/* ===== שתי התמונות (קבועות) עם מחלקות Fade ===== */}
      <img
        src="/src/assets/login.png"
        alt=""
        className={`${styles.decorLoginImg} ${
          isRegister ? styles.fadeOut : styles.fadeIn
        }`}
      />
      <img
        src="/src/assets/register.png"
        alt=""
        className={`${styles.decorRegisterImg} ${
          isRegister ? styles.fadeIn : styles.fadeOut
        }`}
      />

      {/* כפתור חזרה */}
      <button className={styles.backButton} onClick={() => navigate("/")}>
        &larr; חזרה לדף הבית
      </button>

      {/* קונטיינר הטפסים */}
      <div className={`${styles.container} ${isRegister ? styles.active : ""}`}>
        {/* Login */}
        <div className={`${styles.formBox} ${!isRegister ? "" : "hideLogin"}`}>
          {!isRegister && <LoginForm />}
        </div>

        {/* Register */}
        <div
          className={`${styles.formBox} ${styles.register} ${
            isRegister ? "" : "hideRegister"
          }`}
        >
          {isRegister && <RegisterForm />}
        </div>

        {/* לוח המתגים */}
        <div className={styles.toggleBox}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>איזה כיף שחזרת!</h1>
            <p>אין עדיין משתמש?</p>
            <button
              className={`btn ${styles.btn}`}
              onClick={() => setIsRegister(true)}
            >
              הצטרף עכשיו
            </button>
          </div>
          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>הצטרף אלינו!</h1>
            <p>יש כבר משתמש?</p>
            <button
              className={`btn ${styles.btn}`}
              onClick={() => setIsRegister(false)}
            >
              התחבר
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
