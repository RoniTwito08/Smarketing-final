import { useState, useEffect } from "react";
import headerStyles from "./header.module.css";
import { useAuth } from "../../../../context/AuthContext";
import { businessInfoService } from "../../../../services/besinessInfo.service";
import { config } from "../../../../config";

interface HeaderProps {
  businessName?: string;
  title: string;
  buttonText: string;
}

function Header({ businessName, title, buttonText }: HeaderProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { user, accessToken } = useAuth();
  const userId = user?._id;

  // קבע scroll-behavior רק כשצריך, וכבד reduced-motion
  useEffect(() => {
    const root = document?.documentElement;
    if (!root) return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!prefersReduced) {
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = "smooth";
      return () => {
        root.style.scrollBehavior = prev;
      };
    }
  }, []);

  // הבא לוגו
  useEffect(() => {
    let cancelled = false;
    if (userId && accessToken && !logoPreview) {
      businessInfoService
        .getBusinessInfo(userId, accessToken)
        .then((data) => {
          const logoPath = data?.data?.logo;
          if (!cancelled && typeof logoPath === "string" && logoPath.trim()) {
            setLogoPreview(`${config.apiUrl}/${logoPath.replace(/^\/+/, "")}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch business info:", err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [userId, accessToken, logoPreview]);

  if (!userId || !accessToken) return null;

  const handleScroll = () => {
    const el =
      document.getElementById("contactUs") ||
      document.getElementById("contact-us-root");

    if (!el) return;

    // נסה קודם scrollIntoView (נוח ופשוט)
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    } catch {
      /* no-op */
    }

    // גיבוי: גלול לקונטיינר גלילה הקרוב אם יש
    let parent: HTMLElement | null = el.parentElement;
    const isScrollable = (node: Element) => {
      const s = getComputedStyle(node);
      return /(auto|scroll|overlay)/.test(s.overflow + s.overflowY + s.overflowX);
    };
    while (parent && !isScrollable(parent)) {
      parent = parent.parentElement;
    }
    if (parent) {
      parent.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div className={headerStyles.headerWrapper} role="banner">
      <section
        className={headerStyles.headerSectionContainer}
        aria-label="Header"
      >
        <div className={headerStyles.logoContainer}>
          {logoPreview ? (
            <img
              src={logoPreview}
              alt={businessName ? `לוגו של ${businessName}` : title || "לוגו"}
              className={headerStyles.logoCircle}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className={headerStyles.uploadText} aria-live="polite">
              אין לוגו להציג
            </span>
          )}
        </div>

        <h2 className={headerStyles.sectionTitle} title={title}>
          {title}
        </h2>

        <div className={headerStyles.headerButtonContainer}>
          <button
            type="button"
            className={headerStyles.headerSectionButton}
            id="headerButtonContainer"
            onClick={handleScroll}
            aria-label={buttonText}
          >
            {buttonText}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Header;
