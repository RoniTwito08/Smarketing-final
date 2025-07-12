import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.rightCol}>

        <div className={styles.social}>
          <a
            href="https://instagram.com"
            aria-label="אינסטגרם"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M12 2.2c3.2 0 3.6.01 4.9.07 1.2.06 1.9.27 2.35.46.58.23 1 .51 1.44.95.44.44.72.86.95 1.44.19.45.4 1.15.46 2.35.06 1.3.07 1.7.07 4.9s-.01 3.6-.07 4.9c-.06 1.2-.27 1.9-.46 2.35-.23.58-.51 1-.95 1.44-.44.44-.86.72-1.44.95-.45.19-1.15.4-2.35.46-1.3.06-1.7.07-4.9.07s-3.6-.01-4.9-.07c-1.2-.06-1.9-.27-2.35-.46-.58-.23-1-.51-1.44-.95-.44-.44-.72-.86-.95-1.44-.19-.45-.4-1.15-.46-2.35C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.9c.06-1.2.27-1.9.46-2.35.23-.58.51-1 .95-1.44.44-.44.86-.72 1.44-.95.45-.19 1.15-.4 2.35-.46C8.4 2.21 8.8 2.2 12 2.2m0-2.2c-3.28 0-3.69.01-4.98.07-1.29.06-2.18.28-2.95.6a5.62 5.62 0 0 0-2.03 1.32 5.62 5.62 0 0 0-1.32 2.03c-.32.77-.54 1.66-.6 2.95C.21 8.31.2 8.72.2 12s.01 3.69.07 4.98c.06 1.29.28 2.18.6 2.95a5.62 5.62 0 0 0 1.32 2.03 5.62 5.62 0 0 0 2.03 1.32c.77.32 1.66.54 2.95.6 1.29.06 1.7.07 4.98.07s3.69-.01 4.98-.07c1.29-.06 2.18-.28 2.95-.6a5.62 5.62 0 0 0 2.03-1.32 5.62 5.62 0 0 0 1.32-2.03c.32-.77.54-1.66.6-2.95.06-1.29.07-1.7.07-4.98s-.01-3.69-.07-4.98c-.06-1.29-.28-2.18-.6-2.95a5.62 5.62 0 0 0-1.32-2.03 5.62 5.62 0 0 0-2.03-1.32c-.77-.32-1.66-.54-2.95-.6C15.69.01 15.28 0 12 0z" />
              <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.86a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            aria-label="טוויטר"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M22.46 6.01c-.77.34-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.37 8.4 8.4 0 0 1-2.7 1.04 4.23 4.23 0 0 0-7.2 3.86A12 12 0 0 1 3.15 4.2a4.23 4.23 0 0 0 1.31 5.65 4.2 4.2 0 0 1-1.9-.52v.05a4.23 4.23 0 0 0 3.39 4.14 4.26 4.26 0 0 1-1.9.07 4.24 4.24 0 0 0 3.95 2.94A8.5 8.5 0 0 1 2 19.54a12 12 0 0 0 6.29 1.84c7.55 0 11.68-6.28 11.68-11.72 0-.18-.01-.35-.02-.53a8.36 8.36 0 0 0 2.06-2.12z" />
            </svg>
          </a>
        </div>
      </div>
      <div className={styles.leftCol}>
        <div className={styles.brandRow}>
          <span className={styles.brandName}>
            <img
              src="/src/assets/Smarketing.png"
              alt="לוגו Smarketing"
              className={styles.logo}
            />
          </span>
        </div>

        <p className={styles.tagline}>
          מוכנים לשדרג את השיווק הדיגיטלי שלך? הצטרפו אלינו והפכו כל רעיון להזדמנות מנצחת!
        </p>

        <div className={styles.copyRow}>
          <span className={styles.heart}>♡</span>
          <span className={styles.copyText}>
            © {new Date().getFullYear()} Smarketing · כל הזכויות שמורות
          </span>
        </div>
      </div>

     
    </footer>
  );
};

export default Footer;
