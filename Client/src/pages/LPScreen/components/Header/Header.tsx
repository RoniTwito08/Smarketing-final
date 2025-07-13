import React from "react";
import styles from "./Header.module.css";
import menSVG from "../../../../assets/profile.svg"
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/forms");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a onClick={handleLogin} className={styles.ctaBtn}>
          <img src={menSVG} alt="Profile" className={styles.profileIcon} />
        </a>
        
        <div className={styles.logo}>
          <img src="/src/assets/Smarketing.png" alt="Logo" className={styles.logoImage} />
        </div>
      </div>
    </header>
  );
};

export default Header;
