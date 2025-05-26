import { useState, useEffect } from "react";
import headerStyles from "./header.module.css";
import { useAuth } from "../../../../context/AuthContext";
import { businessInfoService } from "../../../../services/besinessInfo.service";
import { config } from "../../../../config";

interface HeaderProps {
  businessName: string;
  title: string;
  buttonText: string;
}

function Header({ title, buttonText }: HeaderProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { user, accessToken } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    if (userId && accessToken && !logoPreview) {
      businessInfoService
        .getBusinessInfo(userId, accessToken)
        .then((data) => {
          if (data.data.logo) {
            setLogoPreview(config.apiUrl + "/" + data.data.logo);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch business info:", err);
        });
    }
  }, [userId, accessToken, logoPreview]);

  if (!userId || !accessToken) return null;
  document.documentElement.style.scrollBehavior = "smooth";

  const handleScroll = () => {
    const el =
      document.getElementById("contactUs") ||
      document.getElementById("contact-us-root");
    console.log("el:", el);
    if (el) {
      // מוצאים את ההורה הגליל
      let parent: HTMLElement | null = el.parentElement;
      while (parent && getComputedStyle(parent).overflowY === "visible") {
        parent = parent.parentElement;
      }
      // אם מצאנו אלמנט עם overflow, מגלגלים בו
      if (parent) {
        parent.scrollTo({
          top: el.offsetTop,
          behavior: "smooth",
        });
      } else {
        // ברירת מחדל ל־window
        document.documentElement.style.scrollBehavior = "smooth";
        el.scrollIntoView({ block: "start" });
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = "";
        }, 1000);
      }
    }
  };
  
  
  return (
    <div className={headerStyles.headerWrapper}>
      <section className={headerStyles.headerSectionContainer}>
        <div className={headerStyles.logoContainer}>
          {logoPreview ? (
            <img
              src={logoPreview}
              alt={title || "Section Logo"}
              className={headerStyles.logo}
            />
          ) : (
            <span className={headerStyles.uploadText}>אין לוגו להציג</span>
          )}
        </div>
        <h2 className={headerStyles.sectionTitle} >{title}</h2>
        <div className={headerStyles.headerButtonContainer}>
          <button
            className={headerStyles.headerSectionButton}
            id="headerButtonContainer"
            onClick={handleScroll}
          >
            {buttonText}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Header;
