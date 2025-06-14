// CampaignDetailsPopup.tsx
import React, { useState } from "react";
import styles from "./CampaignDetailsPopup.module.css";
import { IoMdAnalytics } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { FaRegCirclePause } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { config } from "../../config";
import CreditCard from "../../components/CreditCard/CreditCard";

interface CampaignDetailsPopupProps {
  campaign: any;
  onClose: () => void;
  onSubmit: (campaignId: string) => void; // יש להוסיף פרמטר שיבצע את פעולת ה־submit
  onDelete: (campaignId: string) => void; // פונקציית מחיקה
}

const CampaignDetailsPopup: React.FC<CampaignDetailsPopupProps> = ({
  campaign,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      window.confirm("האם אתה בטוח שברצונך למחוק את הקמפיין?");
      const response = await fetch(
        `${config.apiUrl}/campaigns/${campaign._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("שגיאה במחיקת הקמפיין");
      }

      onDelete(campaign._id); // נעדכן את הסטייט בצד הפיד אחרי שמחקנו את הקמפיין
      onClose(); // סגירת הפופאפ אחרי מחיקת הקמפיין
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };
  const [showCreditCard, setShowCreditCard] = useState(false);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>{campaign.campaignName}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            data-tooltip="סגור"
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>
          {campaign.landingPage ? (
            <iframe
              src={`${config.apiUrl}/landingPages/${campaign.landingPage}`}
              title="Landing Page Preview"
              className={styles.landingPageIframe}
              frameBorder="0"
            ></iframe>
          ) : (
            <div className={styles.landingPagePreview}>
              <p>לא נמצא דף נחיתה</p>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <button
            className={styles.submitBtn}
            onClick={() => onSubmit(campaign._id)}
            data-tooltip="שלח"
          >
            <IoIosSend />
          </button>
          <button
            className={styles.AnalyticsBtn}
            data-tooltip="גרפים ואנליטיקות"
          >
            <IoMdAnalytics />
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            data-tooltip="מחק"
          >
            <MdDeleteOutline />
          </button>
          <button className={styles.pauseBtn} data-tooltip="השהה">
            <FaRegCirclePause />
          </button>
          <button
            className={styles.pay}
            data-tooltip="פרטי תשלום"
            onClick={() => setShowCreditCard(true)}
          >
            <FaCreditCard />
          </button>
        </div>
      </div>
      {showCreditCard && (
        <div onClick={() => setShowCreditCard(false)} className="card-backdrop">
          <div
            onClick={(e) => e.stopPropagation()}
            className="card-animated enlarged-card"
          >
            <CreditCard />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailsPopup;
