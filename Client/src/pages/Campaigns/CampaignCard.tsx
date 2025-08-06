// CampaignCard.tsx
import React from "react";
import styles from "./CampaignCard.module.css";
import { config } from "../../config";
import CampaignIcon from '@mui/icons-material/Campaign';
import LaunchIcon from '@mui/icons-material/Launch';

interface CampaignCardProps {
  campaign: any;
  onClick: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick} style={{ borderRadius: 18, boxShadow: '0 2px 12px rgba(30,41,59,0.08)', background: '#fff', padding: '1.5rem 1.2rem', minHeight: 320, display: 'flex', flexDirection: 'column', gap: '0.7rem', position: 'relative', transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <CampaignIcon sx={{ color: '#6366f1', fontSize: 32 }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{campaign.campaignName}</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 4 }}>
        <span style={{ background: '#f1f5f9', color: '#334155', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: '0.95rem' }}>
          תקציב: {campaign.budget} ₪
        </span>
        <span style={{ background: '#f1f5f9', color: '#334155', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: '0.95rem' }}>
          מטרה: {campaign.campaginPurpose}
        </span>
      </div>
      <div style={{ marginBottom: 6 }}>
        <a
          href={campaign.campaignURL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          <LaunchIcon sx={{ fontSize: 18, mr: 0.5 }} />
          קישור לדף נחיתה
        </a>
      </div>
      {campaign.landingPage && (
        <div className={styles.iframeWrapper} style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(30,41,59,0.10)', marginTop: 8, background: '#f8fafc' }}>
          <iframe
            src={`${config.apiUrl}/landingPages/${campaign.landingPage}`}
            title="Landing Page Preview"
            className={styles.previewIframe}
            frameBorder="0"
            style={{ borderRadius: 10 }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
