// CampaignCard.tsx
import React from "react";
import styles from "./CampaignCard.module.css";
import { config } from "../../config";

interface CampaignCardProps {
  campaign: any;
  onClick: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <h3>{campaign.campaignName}</h3>
      <p>
        <strong>תקציב:</strong> {campaign.budget} ₪
      </p>
      <p>
        <strong>מטרה:</strong> {campaign.campaginPurpose}
      </p>
      <p>
        <a
          href={campaign.campaignURL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} 
        >
          <strong>קישור לדף נחיתה</strong>
        </a>
      </p>
      {campaign.landingPage && (
       <div className={styles.iframeWrapper}>
        <iframe
          src={`${config.apiUrl}/landingPages/${campaign.landingPage}`}
          title="Landing Page Preview"
          className={styles.previewIframe}
          frameBorder="0"
        ></iframe>
      </div>
     
      )}
    </div>
  );
};

export default CampaignCard;
