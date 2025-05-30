import React, { useEffect } from "react";
import styles from "./SidebarTourPopup.module.css";

interface SidebarTourPopupProps {
  title: string;
  description: string;
  targetRef: React.RefObject<HTMLElement>;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const SidebarTourPopup = ({
  title,
  description,
  targetRef,
  step,
  totalSteps,
  onNext,
  onBack,
  onSkip,
}: SidebarTourPopupProps) => {
    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;
    
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add(styles["tour-highlight"]);
    
        return () => {
          target.classList.remove(styles["tour-highlight"]);
        };
      }, [targetRef, step]);
    
      return (
        <div className={styles.bookContainer}>
          <div key={step} className={styles.bookPage}>
            <div className={styles.pageFront}>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className={styles.controls}>
                <button onClick={onBack} disabled={step === 0} className={styles.button}>
                  הקודם
                </button>
                {step < totalSteps - 1 ? (
                  <button onClick={onNext} className={styles.button}>הבא</button>
                ) : (
                  <button onClick={onSkip} className={styles.button}>סיום</button>
                )}
              </div>
              {step < totalSteps - 1 && (
                <button onClick={onSkip} className={styles.skip}>דלג</button>
              )}
            </div>
          </div>
        </div>
      );
    };

export default SidebarTourPopup;
